import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, DropdownButton, Dropdown, Row, Col, Card } from "react-bootstrap";

export function Filter() {
  const [shoes, setShoes] = useState([]);
  const [filterTerm, setFilterTerm] = useState("");
  const [filterType, setFilterType] = useState("name");

  // Fetch shoes from the server
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/shoes`)
      .then((response) => {
        setShoes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shoes:", error);
      });
  }, []);

  // Filter shoes based on filterType and filterTerm
  const filteredShoes = shoes.filter((shoe) => {
    if (filterType === "name") {
      return shoe.name.toLowerCase().includes(filterTerm.toLowerCase());
    } else if (filterType === "type") {
      return shoe.type.toLowerCase().includes(filterTerm.toLowerCase());
    } else if (filterType === "color") {
      return shoe.color.toLowerCase().includes(filterTerm.toLowerCase());
    }
    return true;
  });

  return (
    <Container>
      <Form>
        <Form.Control
          type="text"
          placeholder="Filter..."
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
        />
        <DropdownButton title="Filter By" className="mt-2">
          <Dropdown.Item onClick={() => setFilterType("name")}>Name</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilterType("type")}>Type</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilterType("color")}>Color</Dropdown.Item>
        </DropdownButton>
      </Form>
      <Row className="mt-4">
        {filteredShoes.map((shoe) => (
          <Col key={shoe._id} md={4} lg={3} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={shoe.image}
                alt={shoe.name}
              />
              <Card.Body>
                <Card.Title>{shoe.name}</Card.Title>
                <Card.Text>Type: {shoe.type}</Card.Text>
                <Card.Text>Color: {shoe.color}</Card.Text>
                <Card.Text>Price: ${shoe.price}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}