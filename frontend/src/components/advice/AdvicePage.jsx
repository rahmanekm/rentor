import React from 'react';
import { Container, Row, Col, Card, Accordion } from 'react-bootstrap';
import './AdvicePage.css';

const AdvicePage = () => {
  return (
    <Container className="advice-page-container">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h1>Advice for Renters and Landlords</h1>
          <p className="lead text-center mb-5">
            Welcome to our advice section! Here you'll find helpful tips and articles for renters and landlords.
            Currently, this section provides a general outline. More detailed articles are coming soon!
          </p>

          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header as="h2">Finding the Right Place</Accordion.Header>
              <Accordion.Body>
                <Card className="advice-section">
                  <Card.Body>
                    <Card.Text>
                      Finding the perfect room or flatmate involves careful consideration. Here are some key areas to focus on:
                    </Card.Text>
                    <ul>
                      <li><strong>Define Your Needs:</strong> Clearly list your must-haves (location, budget, room type, amenities) and nice-to-haves.</li>
                      <li><strong>Ask Questions:</strong> Don't hesitate to ask landlords or potential flatmates about the property, neighborhood, bills, house rules, and lifestyle.</li>
                      <li><strong>Understand Agreements:</strong> Thoroughly read any tenancy or flatmate agreements before signing. Understand your rights and responsibilities.</li>
                      <li><strong>Inspect Thoroughly:</strong> When viewing a property, check for maintenance issues, safety features, and overall condition.</li>
                      <li><strong>Trust Your Gut:</strong> If something feels off about a place or a person, it's okay to walk away.</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header as="h2">Living with Flatmates</Accordion.Header>
              <Accordion.Body>
                <Card className="advice-section">
                  <Card.Body>
                    <Card.Text>
                      Sharing a home can be a great experience with the right approach:
                    </Card.Text>
                    <ul>
                      <li><strong>Communication is Key:</strong> Establish open and respectful communication from the start. Discuss expectations and address issues promptly.</li>
                      <li><strong>Share Responsibilities:</strong> Agree on how cleaning, chores, and bill payments will be handled. A rota can be helpful.</li>
                      <li><strong>Respect Personal Space:</strong> Everyone needs their own space and privacy. Be mindful of noise and guests.</li>
                      <li><strong>Resolve Conflicts Calmly:</strong> Disagreements are normal. Address them maturely and be willing to compromise.</li>
                      <li><strong>Be Considerate:</strong> Small acts of thoughtfulness can go a long way in maintaining a harmonious household.</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header as="h2">For Landlords</Accordion.Header>
              <Accordion.Body>
                <Card className="advice-section">
                  <Card.Body>
                    <Card.Text>
                      Effective property management and good tenant relations are crucial for landlords:
                    </Card.Text>
                    <ul>
                      <li><strong>Know Your Legal Obligations:</strong> Understand landlord-tenant laws regarding safety, deposits, eviction, and non-discrimination.</li>
                      <li><strong>Screen Tenants Thoroughly:</strong> Conduct credit checks, verify income, and check references to find reliable tenants.</li>
                      <li><strong>Maintain Your Property:</strong> Keep the property in good repair and respond to maintenance requests promptly.</li>
                      <li><strong>Clear Tenancy Agreements:</strong> Use a comprehensive and legally sound tenancy agreement that clearly outlines terms and conditions.</li>
                      <li><strong>Professional Communication:</strong> Maintain professional and respectful communication with your tenants.</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          
          <p className="text-center mt-5">
            <em>More detailed articles and specific advice topics will be added here soon.</em>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AdvicePage;
