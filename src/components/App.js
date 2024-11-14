import React, { useState } from 'react';
import './App.css';
import logo from '../imagenes/logo-tesoreria.png';
import Swal from 'sweetalert2';
 
function App() {
  const [formData, setFormData] = useState({
    pregunta: '',
    respuesta: '',
    link: ''
  });
  const [numberedList, setNumberedList] = useState([]);
  const [formattedResponse, setFormattedResponse] = useState("");

  const Ruta = "http://192.168.0.210:3002/api/";
 
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value
    }));
 
    // Generar lista numerada si se edita el campo de respuesta
    if (id === 'respuesta') {
      const sentences = value.split('\n').filter(sentence => sentence.trim() !== "");
      setNumberedList(sentences);
 
      // Crear el texto formateado con numeración para enviar a la API
      const formatted = sentences
        .map((sentence, index) => `${index + 1}. ${sentence.trim()}`)
        .join('\n');
      setFormattedResponse(formatted);
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación para asegurar que la pregunta termine con "?"
    if (!formData.pregunta.endsWith('?')) {
      Swal.fire({
        icon: "warning",
        title: "Atención!",
        text: "La pregunta debe terminar con un signo de interrogación.",
      });
      return;
    }
    if (formData.pregunta !== '' && formattedResponse !== '' && formData.link !== '') {
      try {
        const response = await fetch(`${Ruta}preguntas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pregunta: formData.pregunta,
            respuesta: formattedResponse, // Enviar el texto formateado
            link: formData.link
          }),
        });
 
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Proceso completado con éxito",
            text: "Información almacenada correctamente",
          });
          // Limpiar campos después de enviar
          setFormData({
            pregunta: '',
            respuesta: '',
            link: ''
          });
          setNumberedList([]);
          setFormattedResponse("");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se enviaron los datos",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al conectar con la API",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Se deben rellenar todos los campos",
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
<ol className="numbered-list">
            {numberedList.map((sentence, index) => (
<li key={index}>{sentence.trim()}</li>
            ))}
</ol>
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