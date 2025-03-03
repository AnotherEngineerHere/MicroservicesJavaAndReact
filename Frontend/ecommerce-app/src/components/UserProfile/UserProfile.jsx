import React from 'react';
import Swal from 'sweetalert2';

/**
 * UserProfile component to view and edit user information.
 *
 * @component
 * @returns {JSX.Element} The rendered UserProfile component.
 */
const UserProfile = () => {
  // Simulamos la información del usuario. En una aplicación real, se obtendría de un backend o del contexto de autenticación.
  const user = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St, Springfield",
    email: "john.doe@example.com",
    birthDate: "1990-01-15",
    password: "securePassword123"
  };

  /**
   * Opens a modal to display and edit user information.
   */
  const openUserModal = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Información del Usuario',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${user.firstName}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Apellido" value="${user.lastName}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Dirección" value="${user.address}">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Email" value="${user.email}" disabled>` +
        `<input id="swal-input5" type="date" class="swal2-input" placeholder="Fecha de Nacimiento" value="${user.birthDate}">` +
        `<input id="swal-input6" class="swal2-input" placeholder="Contraseña" value="${user.password}">`,
      focusConfirm: false,
      preConfirm: () => {
        return {
          firstName: document.getElementById('swal-input1').value,
          lastName: document.getElementById('swal-input2').value,
          address: document.getElementById('swal-input3').value,
          birthDate: document.getElementById('swal-input5').value,
          password: document.getElementById('swal-input6').value
        };
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Actualizar'
    });

    if (formValues) {
      try {
        const response = await fetch(`http://localhost:9000/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formValues)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al actualizar el usuario');
        }
        Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button
        onClick={openUserModal}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#007bff',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        Ver Información del Usuario
      </button>
    </div>
  );
};

export default UserProfile;
