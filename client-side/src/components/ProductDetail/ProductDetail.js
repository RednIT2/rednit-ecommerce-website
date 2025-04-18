import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export function ProductDetail() {
    const { id } = useParams(); // Lấy id từ URL
    const [product, setProduct] = useState(null);

    useEffect(() => {
        // Fetch chi tiết sản phẩm từ server
        axios
            .get(`${process.env.REACT_APP_API_URL}/shoes/${id}`)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.error("Error fetching product details:", error);
            });
    }, [id]);

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="mt-4 text-center"> {/* Thêm class text-center để căn giữa */}
            <Card className="shadow-lg p-4">
                <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    style={{
                        width: "300px",
                        height: "300px",
                        objectFit: "cover",
                        margin: "0 auto",
                        borderRadius: "10px",
                        border: "2px solid #007bff", // Viền nổi bật
                    }}
                />
                <Card.Body>
                    <Card.Title className="fw-bold fs-3 text-primary">{product.name}</Card.Title> {/* Làm nổi bật tên */}
                    <Card.Text className="text-muted">Type: <span className="fw-bold">{product.type}</span></Card.Text>
                    <Card.Text className="text-muted">Sizes: <span className="fw-bold">{product.sizes.join(", ")}</span></Card.Text>
                    <Card.Text className="text-muted">Color: <span className="fw-bold">{product.color}</span></Card.Text>
                    <Card.Text className="text-danger fs-5">Price: <span className="fw-bold">{product.price} VND</span></Card.Text> {/* Làm nổi bật giá */}
                    <Card.Text className="text-muted">Stock: <span className="fw-bold">{product.stock}</span></Card.Text>
                    <NavLink to="/products" className="btn btn-primary mt-3">
                        Back
                    </NavLink>
                </Card.Body>
            </Card>
        </Container>
    );
}