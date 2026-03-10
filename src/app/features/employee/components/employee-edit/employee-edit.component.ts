import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-edit-modal',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent {
  /** Emituje sačuvanog zaposlenog nazad roditeljskoj komponenti */
  @Output() save = new EventEmitter<Employee>();
  
  /** Emituje događaj za zatvaranje modala bez čuvanja */
  @Output() cancel = new EventEmitter<void>();

  editingEmployee!: Employee;
  editFullName: string = '';

  /**
   * Postavlja podatke zaposlenog i kreira duboku kopiju kako bi se izbegla mutacija
   * pre nego što korisnik potvrdi izmene.
   * @param val Zaposleni koji se menja
   */
  @Input() set employee(val: Employee) {
    if (val) {
      this.editingEmployee = { ...val };
      this.editingEmployee.permissions = [...val.permissions];
      this.editFullName = `${this.editingEmployee.firstName} ${this.editingEmployee.lastName}`.trim();
    }
  }

  /**
   * Dodaje ili uklanja dozvolu iz niza prilikom klikanja na checkbox.
   * @param permission Naziv dozvole
   * @param event DOM događaj
   */
  togglePermission(permission: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.editingEmployee.permissions.push(permission);
    } else {
      this.editingEmployee.permissions = this.editingEmployee.permissions.filter(p => p !== permission);
    }
  }

  /**
   * Priprema podatke i emituje ih roditeljskoj komponenti na čuvanje.
   */
  onSave(): void {
    const nameParts = this.editFullName.trim().split(' ');
    this.editingEmployee.firstName = nameParts[0] || '';
    this.editingEmployee.lastName = nameParts.slice(1).join(' ') || '';
    
    this.save.emit(this.editingEmployee);
  }

  /**
   * Otkazuje izmenu i zatvara modal.
   */
  onCancel(): void {
    this.cancel.emit();
  }
}