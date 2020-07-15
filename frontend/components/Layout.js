import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Octicon, { MarkGithubIcon } from '@primer/octicons-react'

const Layout = props => {
  return (
    <>
      <header>
        <Navbar variant="dark" bg="dark">
          <Container>
            <Navbar.Brand href="/">Honest Test</Navbar.Brand>

            <Nav className="ml-auto">
              <Nav.Link className="nav-link" href="//github.com/nigeon/honest-test" target="_blank"><Octicon icon={MarkGithubIcon} /></Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </header>
      
      <Container>
        <Row className="justify-content-md-center mt-5 mb-5">
          <Col xs={12}>
            <div className="main-content">{props.children}</div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Layout;