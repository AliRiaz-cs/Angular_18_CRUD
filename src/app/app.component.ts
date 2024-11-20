// app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from './model/employee';
import { EmployeeService } from './employee.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  employeeForm: FormGroup = new FormGroup({});
  employeeObj: EmployeeModel = new EmployeeModel();
  employeeList: EmployeeModel[] = [];
  isEditMode = false;  // Add this to track whether we're editing or creating

  constructor(private employeeService: EmployeeService) {
      this.createForm();
  }

  ngOnInit() {
      this.loadEmployees();
  }

  createForm() {
      this.employeeForm = new FormGroup({
          id: new FormControl(null),  // Set to null initially
          name: new FormControl('', [Validators.required]),
          city: new FormControl(''),
          address: new FormControl(''),
          contactNo: new FormControl(''),
          emailId: new FormControl('', [Validators.email]),
          pinCode: new FormControl('', [Validators.required, Validators.minLength(6)]),
          state: new FormControl('')
      });
  }

  onSave() {
      if (this.employeeForm.invalid) {
          return;
      }

      const formData = this.employeeForm.value;
      
      // Remove the id field for new records
      const { id, ...employeeData } = formData;
      
      console.log('Saving employee:', employeeData);

      this.employeeService.addEmployee(employeeData).subscribe({
          next: (response) => {
              console.log('Employee added successfully:', response);
              this.loadEmployees();
              this.reset();
          },
          error: (error) => {
              console.error('Error adding employee:', error);
          }
      });
  }

  onEdit(item: EmployeeModel) {
    if (!item.id) {
        console.error('Cannot edit item without ID');
        return;
    }
    
    console.log('Editing item:', item);
    this.isEditMode = true;
    this.employeeObj = { ...item };
    this.employeeForm.patchValue(item);
}

onUpdate() {
  if (this.employeeForm.invalid) {
      return;
  }

  const formData = this.employeeForm.value;
  const id = formData.id;

  if (!id) {
      console.error('No ID found for update');
      return;
  }

  console.log('Updating employee:', formData);

  this.employeeService.updateEmployee(id, formData).subscribe({
      next: (response) => {
          console.log('Employee updated successfully:', response);
          this.loadEmployees();
          this.reset();
      },
      error: (error) => {
          console.error('Error updating employee:', error);
      }
  });
} 

  onDelete(id: number | undefined) {
    if (!id) {
        console.error('No ID found for delete');
        return;
    }

    const isDelete = confirm("Are you sure you want to delete?");
    if (isDelete) {
        console.log('Deleting employee with id:', id);
        this.employeeService.deleteEmployee(id).subscribe({
            next: () => {
                console.log('Employee deleted successfully');
                this.loadEmployees();
            },
            error: (error) => {
                console.error('Error deleting employee:', error);
            }
        });
    }
}

  loadEmployees() {
      this.employeeService.getEmployees().subscribe({
          next: (data) => {
              console.log('Loaded employees:', data);
              this.employeeList = data;
          },
          error: (error) => {
              console.error('Error fetching employees:', error);
          }
      });
  }

  reset() {
      this.isEditMode = false;
      this.employeeObj = new EmployeeModel();
      this.employeeForm.reset();
      Object.keys(this.employeeForm.controls).forEach(key => {
          const control = this.employeeForm.get(key);
          control?.setErrors(null);
      });
  }
}