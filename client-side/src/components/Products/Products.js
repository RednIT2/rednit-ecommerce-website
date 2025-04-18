import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import HomeIcon from "@mui/icons-material/Home";
import { Update } from "../Update/Update"; // Import component Update

export function Products() {
  const [shoeList, setShoeList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch shoes from the server
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/shoes`)
      .then((response) => {
        setShoeList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shoes:", error);
      });
  }, []);

  const handleEditClick = (shoe) => {
    setEditingId(shoe._id);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/shoes/${id}`)
        .then(() => {
          setShoeList(shoeList.filter((shoe) => shoe._id !== id));
        })
        .catch((error) => {
          console.error("Error deleting shoe:", error);
        });
    }
  };

  const handleSave = (id, formData) => {
    setIsUpdating(true);
    axios
      .put(`${process.env.REACT_APP_API_URL}/shoes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo gửi đúng định dạng
        },
      })
      .then((response) => {
        const updatedShoes = shoeList.map((shoe) =>
          shoe._id === id ? response.data : shoe
        );
        setShoeList(updatedShoes);
        setEditingId(null);
        setIsUpdating(false);
      })
      .catch((error) => {
        console.error("Error updating shoe:", error);
        setIsUpdating(false);
      });
  };

  return (
    <Container>
      <NavLink to="/" className="btn btn-primary mb-3">
        <HomeIcon />
      </NavLink>
      <Row>
        {shoeList.map((shoe) => (
          <Col key={shoe._id} md={4} lg={3} className="mb-4">
            <Card
              className={`shadow-lg h-100 ${editingId === shoe._id ? "ring-2 scale-105" : ""
                }`}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              {editingId === shoe._id ? (
                <Update shoe={shoe} onSave={handleSave} />
              ) : (
                <>
                  <Card.Img
                    variant="top"
                    src={`${process.env.REACT_APP_API_URL}/uploads/${shoe.image}`}
                    alt={shoe.name}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  <Card.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      flexGrow: 1,
                    }}
                  >
                    <Card.Title>{shoe.name}</Card.Title>
                    <Card.Text>Type: {shoe.type}</Card.Text>
                    <Card.Text>Sizes: {shoe.sizes.join(", ")}</Card.Text>
                    <Card.Text>Color: {shoe.color}</Card.Text>
                    <Card.Text>Price: {shoe.price} VND</Card.Text>
                    <Card.Text>Stock: {shoe.stock}</Card.Text>
                    <div>
                      <NavLink
                        to={`/products/${shoe._id}`}
                        className="btn btn-info me-2"
                      >
                        Chi tiết
                      </NavLink>
                      <Button
                        variant="warning"
                        onClick={() => handleEditClick(shoe)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(shoe._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </>
              )}
            </Card>
          </Col>
        ))}
      </Row>
      {isUpdating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-5 rounded-lg shadow-xl">
            <Spinner animation="border" role="status" />
            <p className="mt-3">Đang cập nhật sản phẩm...</p>
          </div>
        </div>
      )}
    </Container>
  );
}