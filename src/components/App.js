import React, { useState } from 'react';
import './App.css';
import logo from '../imagenes/logo-tesoreria.png';
import Swal from 'sweetalert2'

function App() {
  const [formData, setFormData] = useState({
    pregunta: '',
    respuesta: '',
    link: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación para asegurar que la pregunta termine con "?"
    if (!formData.pregunta.endsWith('?')) {
      console.error('La pregunta debe terminar con un signo de interrogación.');
      Swal.fire({
        icon: "warning",
        title: "Atención!",
        text: "La pregunta debe terminar con un signo de interrogación.",
      });
      return;
    }
    if (formData.pregunta !== '' && formData.respuesta !== '' && formData.link !== '') {
      try {
        const response = await fetch('http://192.168.137.1:5000/api/preguntas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Yeii",
            text: "Enviado correctamente",
          });
        } else {
          console.error('Error al enviar los datos');
          Swal.fire({
            icon: "error",
            title: "Oh no!",
            text: "No se enviaron los datos",
          });
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
        Swal.fire({
          icon: "error",
          title: "Rayos!",
          text: "Error al conectar con la API",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Noo!",
        text: "Completa todos los campos!",
      });
    }
  };

  return (
    <div className="App">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      
      <form onSubmit={handleSubmit} className="form-container">
      <div>
      <h1 className="title">TesoHub - Potencia a Tesora</h1>
      </div>
        <div className="form-group">
          <label className="label" htmlFor="pregunta">Pregunta</label>
          <input
            type="text"
            id="pregunta"
            className="input"
            placeholder="Escribe tu pregunta aquí"
            value={formData.pregunta}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="respuesta">Respuesta</label>
          <textarea
            id="respuesta"
            className="textarea"
            placeholder="Escribe tu respuesta aquí"
            rows="4"
            value={formData.respuesta}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label className="label" htmlFor="link">Documento asociado (URL)</label>
          <input
            type="url"
            id="link"
            className="input"
            placeholder="https://ejemplo.com/documento"
            value={formData.link}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">Enviar</button>
      </form>
      
    </div>
    
  );
}

export default App;
