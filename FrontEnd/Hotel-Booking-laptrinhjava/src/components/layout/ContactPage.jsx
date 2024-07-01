import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import styled from "styled-components";
import { Modal, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactPage = () => {
    const form = useRef();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                "service_tp85cty",
                "template_ds33i3m",
                form.current,
                "BieiCri1NqsKdo50k"
            )
            .then(
                (result) => {
                    console.log(result.text);
                    console.log("message sent");
                    handleShow(); // Hiển thị modal khi gửi thành công
                },
                (error) => {
                    console.log(error.text);
                }
            );
    };

    return (
        <div className="ContactArea">
            <StyledContactForm>
                <form ref={form} onSubmit={sendEmail}>
                    <label>Name</label>
                    <input type="text" name="user_name" required/>
                    <label>Email</label>
                    <input type="email" name="user_email" required />
                    <label>Message</label>
                    <textarea name="message" required/>
                    <input type="submit" value="Send" />
                </form>
            </StyledContactForm>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your message has been sent successfully!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ContactPage;

// Styles
const StyledContactForm = styled.div`
    width: 400px;

    form {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        width: 100%;
        font-size: 16px;

        input {
            width: 100%;
            height: 35px;
            padding: 7px;
            outline: none;
            border-radius: 5px;
            border: 1px solid rgb(220, 220, 220);

            &:focus {
                border: 2px solid rgba(0, 206, 158, 1);
            }
        }

        textarea {
            max-width: 100%;
            min-width: 100%;
            width: 100%;
            max-height: 100px;
            min-height: 100px;
            padding: 7px;
            outline: none;
            border-radius: 5px;
            border: 1px solid rgb(220, 220, 220);

            &:focus {
                border: 2px solid rgba(0, 206, 158, 1);
            }
        }

        label {
            margin-top: 1rem;
        }

        input[type="submit"] {
            margin-top: 2rem;
            cursor: pointer;
            background: rgb(249, 105, 14);
            color: white;
            border: none;
        }
    }
`;
