import { useContext } from 'react'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import {
  Button,
  Card,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from 'react-bootstrap'
import MessageBox from '../components/MessageBox'
import { Link, useNavigate } from 'react-router-dom'
import { FaPlusCircle, FaMinusCircle, FaTrash } from 'react-icons/fa'

export default function CartPage() {
  const {
    state: {
      mode,
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store)

  const navigate = useNavigate()

  const updateCartHandler = (item: CartItem, quantity: number) => {
    if (item.countInStock < quantity) {
      toast.warn('Sorry. Product is out of stock.')
      return
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
  }

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping')
  }

  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  return (
    <div>
      <Helmet>
        <title>MB Shop | Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item: CartItem) => (
                <ListGroupItem key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded thumbnail"
                      />{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant={mode}
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <FaMinusCircle />
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant={mode}
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.countInStock === item.quantity}
                      >
                        <FaPlusCircle />
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        variant={mode}
                        onClick={() => removeItemHandler(item)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal (
                    {cartItems!.reduce(
                      (a: number, c: CartItem) => a + c.quantity,
                      0
                    )}{' '}
                    items): $
                    {cartItems.reduce(
                      (a: number, c: CartItem) => a + c.quantity * c.price,
                      0
                    )}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => checkoutHandler()}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
