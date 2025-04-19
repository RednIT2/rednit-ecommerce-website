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

    const validateField = (field, value) => {
        let error = "";
    
        switch (field) {
            case "name":
                if (!value.trim() || value.length <= 4) {
                    error = "Name is required and must be at least 4 characters.";
                }
                break;
            case "price":
                if (!value.trim() || isNaN(value) || Number(value) <= 0) {
                    error = "Price must be a positive number.";
                }
                break;
            case "stock":
                if (!value.trim() || isNaN(value) || Number(value) < 0) {
                    error = "Stock must be a positive number.";
                }
                break;
            case "sizes":
                if (!value.trim()) {
                    error = "Please enter sizes.";
                } else {
                    const sizeArray = value.split(',').map(size => size.trim());
                    if (sizeArray.some(size => isNaN(size) || Number(size) <= 0)) {
                        error = "Size must be a positive number and greater than 0.";
                    }
                }
                break;
            case "color":
                if (!value.trim()) {
                    error = "Please enter color.";
                }
                break;
            case "type":
                if (!value.trim()) {
                    error = "Please enter type.";
                }
                break;
            case "image":
                if (!value) {
                    error = "Please choose an image.";
                }
                break;
            default:
                break;
        }
    
        return error;
    };

    const handleSaveClick = async () => {
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
        <Container className="py-5">
            <div className="mb-4">
                <NavLink to="/" className="btn btn-outline-primary flex items-center gap-2">
                    <HomeIcon />
                </NavLink>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Add New Shoe</h2>
                <Form className="grid md:grid-cols-2 gap-4">
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
                            onBlur={(e) => setErrors({ ...errors, name: validateField("name", e.target.value) })}
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
                            onBlur={(e) => setErrors({ ...errors, price: validateField("price", e.target.value) })}
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
                            onBlur={(e) => setErrors({ ...errors, color: validateField("color", e.target.value) })}
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
                            onBlur={(e) => setErrors({ ...errors, sizes: validateField("sizes", e.target.value) })}
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
                            onAbort={(e) => setErrors({ ...errors, stock: validateField("stock", e.target.value) })}
                            placeholder="Enter stock..."
                            isInvalid={!!errors.stock}
                        />
                        <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control 
                            type="file" 
                            onChange={handleImageChange}
                            onBlur={(e) => setErrors({ ...errors, image: validateField("image", addImage) })}
                            isInvalid={!!errors.image}
                        />
                        <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
                    </Form.Group>
                </Form>

                {addImage && (
                    <div className="mt-4">
                        <img
                            src={URL.createObjectURL(addImage)}
                            alt="Preview"
                            className="w-100 h-200 object-cover rounded-xl shadow"
                        />
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Button variant="success" onClick={handleSaveClick} className="px-4 py-2 text-lg rounded-xl shadow-md">
                        Save Product
                    </Button>
                </div>
            </div>
        </Container>
    );
}
