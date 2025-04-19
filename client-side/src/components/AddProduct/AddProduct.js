import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import HomeIcon from "@mui/icons-material/Home";
import { NavLink, useNavigate } from "react-router-dom";

export function AddProduct() {
    const [addName, setAddName] = useState("");
    const [addSize, setAddSize] = useState("");
    const [addPrice, setAddPrice] = useState("");
    const [addType, setAddType] = useState("");
    const [addColor, setAddColor] = useState("");
    const [addStock, setAddStock] = useState("");
    const [addImage, setAddImage] = useState("");
    const [generatedId, setGeneratedId] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchGeneratedId = async () => {
            if (!addType) return;
    
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/shoes/generate-id`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ type: addType }),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setGeneratedId(data.generatedId); // Lưu ID vào state
                }
            } catch (error) {
                console.error("Error generating ID:", error);
            }
        };
    
        fetchGeneratedId();
    }, [addType]);

    const navigate = useNavigate();

    const getBrandCode = (type) => {
        switch (type) {
        case "Puma":
            return "PM";
        case "Nike":
            return "NK";
        case "Adidas":
            return "AD";
        default:
            return "XX";
        }
    };

    function validateInputs() {
        let newErrors = {};
    
        if (!addName.trim() || addName.length <= 4) newErrors.name = "Name is required and must be at least 4 characters.";
        if (!addPrice.trim() || isNaN(addPrice) || Number(addPrice) <= 0) 
            newErrors.price = "Price must be a positive number.";
        if (!addStock.trim() || isNaN(addStock) || Number(addStock) < 0) 
            newErrors.stock = "Stock must be a positive number.";
        if (!addSize.trim()) {
            newErrors.sizes = "Please enter sizes.";
        } else {
            const sizeArray = addSize.split(',').map(size => size.trim());
            if (sizeArray.some(size => isNaN(size) || Number(size) <= 0)) 
                newErrors.sizes = "Size must be a positive number and greater than 0.";
        }
        if (!addColor.trim()) {
            newErrors.color = "Please enter color.";
        }
        if (!addType.trim()) {
            newErrors.type = "Please enter type.";
        }
        if (!addImage) newErrors.image = "Please choose an image.";
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; 
    }

    const handleSaveClick = async () => {
        if (!validateInputs()) {
            return;
        }

        const brandCode = getBrandCode(addType);

        const formData = new FormData();
        formData.append("name", addName);
        formData.append("type", addType);
        formData.append("sizes", addSize);
        formData.append("color", addColor);
        formData.append("price", addPrice);
        formData.append("stock", addStock);
        formData.append("brandCode", brandCode);
        if (addImage) {
            formData.append("image", addImage);
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/shoes`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setGeneratedId(data.shoe.id);

                setAddName("");
                setAddPrice("");
                setAddSize("");
                setAddType("");
                setAddColor("");
                setAddStock("");
                setAddImage("");

                navigate("/products");
            } else {
                alert("Failed to add shoe");
            }
        } catch (error) {
            console.error("Error adding shoe:", error);
            alert("An error occurred while adding the shoe");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAddImage(file);
        }
    };
    
    return (
        <Container>
            <NavLink to="/" className="btn btn-primary mb-3">
                <HomeIcon />
            </NavLink>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Generated ID</Form.Label>
                    <Form.Control type="text" value={generatedId} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={addName} 
                        onChange={(e) => setAddName(e.target.value)} 
                        placeholder="Enter name shoe..." 
                        isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Select value={addType} onChange={(e) => setAddType(e.target.value)}>
                        <option value="">-- Select type --</option>
                        <option value="Others">Others</option>
                        <option value="Puma">Puma</option>
                        <option value="Nike">Nike</option>
                        <option value="Adidas">Adidas</option>
                    </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control 
                        type="number" 
                        value={addPrice} 
                        onChange={(e) => setAddPrice(e.target.value)} 
                        placeholder="Enter price..." 
                        isInvalid={!!errors.price}
                    />
                    <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                        type="text"
                        value={addColor}
                        onChange={(e) => setAddColor(e.target.value)}
                        placeholder="Enter color..."
                        isInvalid={!!errors.color}
                    />
                    <Form.Control.Feedback type="invalid">{errors.color}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Sizes (comma separated)</Form.Label>
                    <Form.Control
                        type="number"
                        value={addSize}
                        onChange={(e) => setAddSize(e.target.value)}
                        placeholder="Enter sizes..."
                        isInvalid={!!errors.sizes}
                    />
                    <Form.Control.Feedback type="invalid">{errors.sizes}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                        type="text"
                        value={addStock}
                        onChange={(e) => setAddStock(e.target.value)}
                        placeholder="Stock"
                        isInvalid={!!errors.stock}
                    />
                    <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>
                {addImage && (
                <img
                    src={URL.createObjectURL(addImage)}
                    alt="Preview"
                    className="img-thumbnail mb-3"
                />
                )}
                <Button variant="success" onClick={handleSaveClick}>Save</Button>
            </Form>
        </Container>
    );
}