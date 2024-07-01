import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import moment from "moment";
import { getAvailableRooms } from "../utils/ApiFunctions";
import RoomSearchResults from "./RoomSearchResult";
import RoomTypeSelector from "./RoomTypeSelector";

const RoomSearch = () => {
  const [searchQuery, setSearchQuery] = useState({
    checkInDate: "",
    checkOutDate: "",
    roomType: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const checkInMoment = moment(searchQuery.checkInDate);
    const checkOutMoment = moment(searchQuery.checkOutDate);
    if (!checkInMoment.isValid() || !checkOutMoment.isValid()) {
      setErrorMessage("Xin hãy nhập ngày hợp lệ");
      return;
    }
    if (!checkOutMoment.isSameOrAfter(checkInMoment)) {
      setErrorMessage("Ngày Check-Out phải trước ngày Check-In");
      return;
    }
    setIsLoading(true);
    getAvailableRooms(searchQuery.checkInDate, searchQuery.checkOutDate, searchQuery.roomType)
      .then((response) => {
        setAvailableRooms(response.data);
        setHasSearched(true);
        setTimeout(() => setIsLoading(false), 2000);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
    const checkInDate = moment(searchQuery.checkInDate);
    const checkOutDate = moment(searchQuery.checkOutDate);
    if (checkInDate.isValid() && checkOutDate.isValid()) {
      setErrorMessage("");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery({
      checkInDate: "",
      checkOutDate: "",
      roomType: ""
    });
    setAvailableRooms([]);
    setHasSearched(false);
  };

  useEffect(() => {
    if (availableRooms.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [availableRooms]);

  return (
    <>
      <Container className="shadow mt-n5 mb-5 py-5">
        <Form onSubmit={handleSearch}>
          <Row className="justify-content-center">
            <Col xs={12} md={3}>
              <Form.Group controlId="checkInDate">
                <Form.Label>Ngày Check-In</Form.Label>
                <Form.Control
                  type="date"
                  name="checkInDate"
                  value={searchQuery.checkInDate}
                  onChange={handleInputChange}
                  min={moment().format("YYYY-MM-DD")}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group controlId="checkOutDate">
                <Form.Label>Ngày Check-out</Form.Label>
                <Form.Control
                  type="date"
                  name="checkOutDate"
                  value={searchQuery.checkOutDate}
                  onChange={handleInputChange}
                  min={moment().format("YYYY-MM-DD")}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group controlId="roomType">
                <Form.Label>Loại Phòng</Form.Label>
                <div className="d-flex">
                  <RoomTypeSelector
                    handleRoomInputChange={handleInputChange}
                    newRoom={searchQuery}
                    allowAddNew={false} // Do not show the "Add New" option
                  />
                  <Button variant="secondary" type="submit" className="ml-2">
                    Tìm Kiếm
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {isLoading ? (
          <p className="mt-4">Tìm kiếm phòng hợp lệ...</p>
        ) : hasSearched ? (
          availableRooms.length > 0 ? (
            <RoomSearchResults results={availableRooms} onClearSearch={handleClearSearch} />
          ) : (
            <p className="mt-4">Không có phòng nào phù hợp cho ngày chọn...</p>
          )
        ) : null}
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </Container>
    </>
  );
};

export default RoomSearch;
