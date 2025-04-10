import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 text-center">
      <Row>
        <Col>
          <h2>Report Submitted Successfully</h2>
          <p>Your report has been sent. Thank you for your input!</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Submit Another Report
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SuccessPage;
