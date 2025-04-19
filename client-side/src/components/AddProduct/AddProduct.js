import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import {ShoeForm} from "../ui/ShoeForm";
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

    const navigate = useNavigate();

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
                    setGeneratedId(data.generatedId);
                }
            } catch (error) {
                console.error("Error generating ID:", error);
            }
        };

        fetchGeneratedId();
    }, [addType]);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAddImage(file);
        }
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

                // Reset form
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

    return (
        <Container>
            <NavLink to="/" className="btn btn-primary mb-3">
                <HomeIcon />
            </NavLink>

            <ShoeForm
                values={{
                    name: addName,
                    type: addType,
                    price: addPrice,
                    color: addColor,
                    sizes: addSize,
                    stock: addStock,
                    image: addImage,
                }}
                errors={errors}
                onChange={(field) => (e) => {
                    const value = e.target.value;
                    switch (field) {
                        case "name": setAddName(value); break;
                        case "type": setAddType(value); break;
                        case "price": setAddPrice(value); break;
                        case "color": setAddColor(value); break;
                        case "sizes": setAddSize(value); break;
                        case "stock": setAddStock(value); break;
                        default: break;
                    }
                }}
                onBlur={(field) => (e) => {
                    const value = field === "image" ? addImage : e.target.value;
                    setErrors((prev) => ({
                        ...prev,
                        [field]: validateField(field, value)
                    }));
                }}
                onImageChange={handleImageChange}
                onSubmit={handleSaveClick}
                generatedId={generatedId}
            />
        </Container>
    );
}