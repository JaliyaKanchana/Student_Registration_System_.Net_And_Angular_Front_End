import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';



export enum ModalState {
  None,
  Add,
  Edit,
  View
}

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: any[] = [];
  selectedStudent: any = {};
  isModalOpen = false;
  selectedFile: File | null = null;


  currentModalState: ModalState = ModalState.None;


  ModalState = ModalState;

  constructor(
    private studentService: StudentService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe(data => {
      this.students = data;
    });
  }

  onRowClick(id: number): void {
    this.studentService.getStudent(id).subscribe(
      data => {
        this.selectedStudent = data;
        this.isModalOpen = true;
        this.currentModalState = ModalState.View;
      },
      error => {
        console.error("Error fetching student details:", error);
      }
    );
  }



  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  openCreateModal(): void {
    this.currentModalState = ModalState.Add;
    this.isModalOpen = true;
    this.selectedStudent = {};
  }

  saveChanges(): void {
    if (this.currentModalState === ModalState.Edit) {
        this.updateStudent();
    } else if (this.currentModalState === ModalState.Add) {
        this.addStudent();
    }
  }

  addStudent(): void {
    const formData: FormData = this.createStudentFormData();
    this.studentService.createStudent(formData).subscribe(response => {
      this.loadStudents();
      this.isModalOpen = false;
    }, error => {
      console.error("Error creating student:", error);
    });
  }

  updateStudent(): void {
    const formData: FormData = this.createStudentFormData();
    this.studentService.updateStudent(this.selectedStudent.id, formData).subscribe(response => {
      this.loadStudents();
      this.isModalOpen = false;
      console.log(this.selectedStudent);
    }, error => {
      console.error("Error updating student:", error);
    });
  }

  createStudentFormData(): FormData {
    const formData: FormData = new FormData();
    formData.append('FirstName', this.selectedStudent.firstName);
    formData.append('LastName', this.selectedStudent.lastName);
    formData.append('Mobile', this.selectedStudent.mobile);
    formData.append('Email', this.selectedStudent.email);
    formData.append('NIC', this.selectedStudent.nic);
    formData.append('DateOfBirth', this.selectedStudent.dateOfBirth);
    formData.append('Address', this.selectedStudent.address);
    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile, this.selectedFile.name);
    }
    return formData;
  }

  onFileChanged(event: any): void {
    this.selectedFile = <File>event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
        this.selectedStudent.profileImage = e.target.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  openEditModal(id: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.studentService.getStudent(id).subscribe(
      data => {
        this.selectedStudent = data;
        this.isModalOpen = true;
        this.currentModalState = ModalState.Edit;
      },
      error => {
        console.error("Error fetching student details:", error);
      }
    );
  }

  deleteStudent(id: number): void {
    this.studentService.deleteStudent(id).subscribe(response => {
      this.loadStudents();
    }, error => {
      console.error("Error deleting student:", error);
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.currentModalState = ModalState.None;
    this.selectedStudent = {};
    this.selectedFile = null;
  }
}
