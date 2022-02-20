import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client"

// Definicion de la mutacion para Crear un post
const CREATE_POST = gql`
mutation CreatePost($title: String!, $content: String!){
  postCreate(post: {
    title: $title,
    content: $content
  }) {
    userErrors {
      message
    }
    post {
      title
      content
      createdAt
      published
      user {
        name
      }
    }
  }
}
`

export default function AddPostModal() {
  // Usar el State de React
  const [show, setShow] = useState(false);

  // Ejecutar la mutacion de Crear post
  const [ createPost, { data, loading } ] = useMutation(CREATE_POST)

  // Funcion para cerrar el modal
  const handleClose = () => setShow(false);
  // Funcion para abrir el modal
  const handleShow = () => setShow(true);

  // Usar el State para la variable contenido para que cuando cambie se recargue el componente
  const [content, setContent] = useState("");
  // Usar el State para la variable titulo para que cuando cambie se recargue el componente
  const [title, setTitle] = useState("");

  // Usar el State para la variable error para que cuando aparezca un error se recargue el componente
  const [error, setError] = useState(null);

  // Se ejecuta cada vez que cambia el data
  useEffect(() => {
    // Si existe data
    if(data) {
      // Si hay errores
      if(data.postCreate.userErrors.length) {
        setError(data.postCreate.userErrors[0].message)
      }
    }
  }, [data])

  // Función para cuando creamos el post
  const handleClick = () => {
    if(!content || !title) setError("Debes introducir titulo y contenido");
    else createPost({
      variables: {
        title,
        content
      },
    },
    handleClose())
    
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Post
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {error && <p>{error}</p>}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClick}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
