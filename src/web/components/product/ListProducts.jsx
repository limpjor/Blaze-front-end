import {Component } from 'react';
import HOC from '../../containers/HOC';
import { Table, Button,Row,Col,Modal,Form,Alert,closeButton} from 'react-bootstrap'; 
import {CONSTANT} from '../../../utils/constant'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit,faTrashAlt } from '@fortawesome/free-solid-svg-icons'


class ListProducts extends Component {
    state={
        modalShow:false,
        modal:{
            show:false
        },
        id: 0,
        name: '',
        category:'',
        price: 0,
        status: "Active",
        listProducts:[],
        listStatus:[
            {id:0,description:"Active"},
            {id:1,description:"Inactive"},
        ],
        valName: true,
        valCategory:true,
        valPrice: true,
        valStatus: true,
        valForm:true,
        errorMessage:null,
        alert:{
            head:"Alert",
            show:false,
            type:"primary"
        },
        buttonSave:{show:true}
    }
    componentDidMount(){
        this.getProduct();
    }

    setModalShow = (show) => (e)  => {
        this.setState({
            modal:{show:show},
            buttonSave:{show:true}
        })
    }   

    setAlertShow = (show) => (e)  => {
        this.setState({
            alert:{
                show:show
            }
        })
    }   

    getProduct(){
        this.props.callService("GET",CONSTANT.PRODUCTS.GET).then(
            res=>{
               this.setState({listProducts:res.data}) 
            }).catch(e =>{
                this.setState({
                    alert:{show:false, type:"danger",head:"Error:"},
                    errorMessage:"Failed to get Product.",
                })
            })
    }

    validateField () {
        let val=true;
        if (this.state.name.trim()===''){
            this.setState({valName:false});
            val= false;
        }
        if (this.state.price.toString().trim()===''){
            this.setState({valPrice:false});
            val= false;
        }
        if (this.state.category.trim()===''){
            this.setState({valCategory:false});
            val= false;
        }
        return val;
    }

    saveProduct =  (e)  => {
        let product={};
        if(this.validateField()){
            product={
                id: (parseInt(this.state.listProducts.slice(-1).pop().id)+1).toString(),
               category: this.state.category,
               name: this.state.name,
               price: this.state.price,
               status: this.state.status
             }
             let request = `category=${product.category}&id=${product.id}&name=${product.name}&price=${product.price}&status=${product.status}`
             
             this.props.callService("POST",CONSTANT.PRODUCTS.INSERT+`?${request}`,{}).then(
               res=>{
                   this.setState({
                       alert:{show:true, type:"info",head:"Alert:"},
                       errorMessage:"Successful Registration.",
                       modal:{show:false},
                       category: null,
                       name: null,
                       price: null,
                       status: null
                   },() => {
                       this.getProduct();
                   })
               }).catch(e =>{
                   this.setState({
                       alert:{show:true, type:"danger",head:"Error:"},
                       errorMessage:"Failed to register Product.",
                       error:true
                   })
               })
        }
        
    }

    onChange =(e)  => {
        let { name, value } = e.target; 
        if("name"===name){
            this.setState({valName:true,valForm:true});
        }
        if("category"===name){
            this.setState({valCategory:true,valForm:true});
        }
        if("price"===name){
            this.setState({valPrice:true,valForm:true});
        }
        console.log("e.target:",e.target)
        console.log("name:",name)
        console.log("value:",value)
        this.setState({ [name] : value }, () => {});

    }
    editProduct = (prod) => (e) =>{
        
            this.setState({
                modal:{
                    show:true
                },
                buttonSave:{show:false},
                id:prod.id,
                category: prod.category,
                name: prod.name,
                price: prod.price,
                status: prod.status,
            })
    }
    update = (e) => {
        let product={};
         if(this.validateField()){
            product={
                id: this.state.id,
            category: this.state.category,
            name: this.state.name,
            price: this.state.price,
            status: this.state.status
            }
            let request = `category=${product.category}&id=${product.id}&name=${product.name}&price=${product.price}&status=${product.status}`
            
            this.props.callService("PUT",CONSTANT.PRODUCTS.UPDATE+`/{id}?${request}`,{}).then(
            res=>{
                this.setState({
                    alert:{show:true, type:"info",head:"Alert:"},
                    errorMessage:"Successful Update.",
                    modal:{show:false},
                    category: null,
                    name: null,
                    price: null,
                    status: null
                },() => {
                    this.getProduct();
                })
            }).catch(e =>{
                this.setState({
                    alert:{show:true, type:"danger",head:"Error:"},
                    errorMessage:"Failed to update Product.",
                    error:true
                })
            })
        }
    }
    delete = (id) => (e) => {
        this.props.callService("DELETE",CONSTANT.PRODUCTS.DELETE+`/${id}`,{}).then(
            res=>{
                this.setState({
                    alert:{show:true, type:"info",head:"Alert:"},
                    errorMessage:"Successful Delete.",
                    modal:{show:false},
                    category: null,
                    name: null,
                    price: null,
                    status: null
                },() => {
                    this.getProduct();
                })
            }).catch(e =>{
                this.setState({
                    alert:{show:true, type:"danger",head:"Error:"},
                    errorMessage:"Failed to Delete Product.",
                    error:true
                })
            })
    }
    render(){    
         return(
             <div>
                 <Alert show={this.state.alert.show} variant={this.state.alert.type}>
                    <Alert.Heading>{this.state.alert.head}</Alert.Heading>
                    <p>
                   {this.state.errorMessage}
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                    <Button onClick={this.setAlertShow(false)} variant="outline-success">
                       close
                    </Button>
                    </div>
                </Alert>
                <Row>
                    <Col className="s12 m12 l12" >
                        <h1>Products</h1>
                    </Col>
                </Row>
                <Row>
                    <Col className="s12 m12 l12" style={{textAlign: "right" }}>
                        <Button variant="primary" onClick = {this.setModalShow(true)}>Create Product</Button>
                    </Col>
                </Row>
                <Row>
                    <Col className="s12 m12 l12" >
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.listProducts.map((product, i) => {     
                                    return (
                                        <tr key={i}>
                                            <td>{product.id}</td>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>{`$ ${product.price}`}</td>
                                            <td>{product.status}</td>
                                            <td>
                                                <div >
                                                    <Row>
                                                        <Col className="s2 m2 l2" style={{textAlign: 'right' }}>
                                                            <Button variant="primary" onClick = {this.editProduct(product)}>
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </Button>
                                                        </Col>
                                                        <Col className="s2 m2 l2" >
                                                            <Button variant="secondary" onClick = {this.delete(product.id)}>
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </td>
                                        </tr>
                                    )})
                                }
                            </tbody>
                        </Table> 
                    </Col>
                </Row>
                <Modal show={this.state.modal.show} onHide={this.setModalShow(false)}>
                    <Modal.Header aria-label="Hide" closeButton>
                        <Modal.Title>New Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                        <Form.Group as={Row} className="mb-3" controlId="formHorizontalProduct">
                            <Form.Label column sm={2}> Name:</Form.Label>
                            <Col sm={10} >
                                <Form.Control type="text" placeholder="Start Name" onChange={this.onChange}  name="name"  value={this.state.name} />
                                {(this.state.valName)?'':<Form.Text id="valName" style={{color:'red'}}  muted>Required</Form.Text>}
                            </Col>
                            
                            <Form.Label column sm={2} style={{marginTop:'10px'}}> Category:</Form.Label>
                            <Col sm={10} style={{marginTop:'10px'}}>
                                <Form.Control type="text" placeholder="Start Category" onChange={this.onChange}  name="category" value={this.state.category} />
                                {(this.state.valCategory)?'':<Form.Text id="valCategory" style={{color:'red'}}  muted>Required</Form.Text>}
                            </Col>
                            <Form.Label column sm={2} style={{marginTop:'10px'}}> Price:</Form.Label>
                            <Col sm={10} style={{marginTop:'10px'}}>
                                <Form.Control type="number" placeholder="Start Price" onChange={this.onChange}  name="price" value={this.state.price} />
                                {(this.state.valPrice)?'':<Form.Text id="valPrice" style={{color:'red'}}  muted>Required</Form.Text>}
                            </Col>
                            <Form.Label column sm={2} style={{marginTop:'10px'}}> Status</Form.Label>
                            <Col sm={10} style={{marginTop:'10px'}}>
                                <Form.Control  as="select" placeholder="Start Status" onChange={this.onChange}  name="status" value={this.state.status} >
                                    
                                    {this.state.listStatus.map((status, i) => {     
                                                return (
                                                    <option key={i} value={status.description}>{status.description}</option>
                                                )})
                                    }
                                </Form.Control>
                            </Col>
                            
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.setModalShow(false)}>
                        Close
                    </Button>
                    {<div>
                        {
                            (this.state.buttonSave.show)?
                            <Button variant="primary" onClick={this.saveProduct}>
                                Save
                            </Button>
                            :
                            <Button variant="primary" onClick={this.update}>
                                Update
                            </Button>
                        }
                    </div>
                    }
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}
export default HOC(ListProducts);
