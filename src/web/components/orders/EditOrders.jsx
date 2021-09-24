import {Component } from 'react';
import HOC from '../../containers/HOC'
import { Button,Form,Col,Row,Table,Modal,closeButton } from 'react-bootstrap'; 
import {EDITORDERS} from '../../../service/actions'
import {CONSTANT} from '../../../utils/constant'
import moment from 'moment';

//moment(Date.now()).format('YYYY-MM-DD')
class EditOrders extends Component {
    state={
        modal:{
            show:false
        },
        listProducts:[],
        listProductsOrder:this.props.listProductsOrder,
        customer:(this.props.order)? this.props.order.consumer:null,
        status:(this.props.order)?this.props.order.status:null,
        date: (this.props.newOrder)?moment(Date.now()).format('DD/MM/YYYY'):(this.props.order)?this.props.order.date:null,
        newOrder:(this.props.newOrder),
        orderNumber:(this.props.order)?this.props.order.orderNumber:null,
        listCost:this.props.listProductsOrder.map((productOrder, i) => {     
            return (
               productOrder.cost
            )}),
        id:null,
        name:'Chocolate',
        quantity:0,
        unitPrice:0.0,
        cost:0.0,
        valQuantity:true,
        total:0,

        subtotal:0.00,
        totalCityTax:0.00,
        totalCountryTax:0.00,
        totalStateTax:0.00,
        totalFederalTax:0.00,
        totalTaxes:0.00,

        newListProductsOrder:[]
    }

    componentDidMount(){
        this.calcTax();
    }
    calcTax(){
        let reducer = (previousValue, currentValue) => previousValue + currentValue;
        
        this.setState({
            subtotal:(this.state.listCost.length===0)?0.00:(this.state.listCost.reduce(reducer).toFixed(2))
         },()=>{
            this.setState({
                totalCityTax: ((this.state.subtotal*10)/100).toFixed(2)
            },()=>{
                this.setState({
                    totalCountryTax:(( (parseFloat(this.state.subtotal) + parseFloat(this.state.totalCityTax))*5)/100).toFixed(2)
                },()=>{
                    this.setState({
                        totalStateTax:((( parseFloat(this.state.subtotal) + parseFloat(this.state.totalCityTax) + parseFloat(this.state.totalCountryTax))*8)/100).toFixed(2)
                    },()=>{
                        this.setState({
                            totalFederalTax:((( parseFloat(this.state.subtotal) + parseFloat(this.state.totalCityTax) + parseFloat(this.state.totalCountryTax) + parseFloat(this.state.totalStateTax))*2)/100).toFixed(2)
                        },()=>{
                            this.setState({
                                totalTaxes:(
                                    parseFloat(this.state.totalCityTax)+
                                    parseFloat(this.state.totalCountryTax)+
                                    parseFloat(this.state.totalStateTax)+
                                    parseFloat(this.state.totalFederalTax)+
                                    parseFloat(this.state.subtotal)       
                                    ).toFixed(2)
                            })
                        })
                    })
                }) 
            })
         })
    }
    addItem =  (e)  => {
        let listTemp =(this.state.listProductsOrder.length>0)?this.state.listProductsOrder:[];
        let newListTemp = [];
        listTemp.push(
            {
                name:this.state.name,
                quantity:this.state.quantity,
                unitPrice:this.state.unitPrice,
                cost:this.state.cost,
            }
        )
        newListTemp.push(
            {
                name:this.state.name,
                quantity:this.state.quantity,
                unitPrice:this.state.unitPrice,
                cost:this.state.cost,
            }
        )//this.calcTax();

        
        this.setState({
            listProductsOrder:listTemp,
            newListProductsOrder:newListTemp,
            modal:{show:false}
         },()=>{
            this.setState({
                listCost:this.state.listProductsOrder.map((productOrder, i) => {     
                    return (
                       productOrder.cost
                    )})
             },()=>{
                 this.calcTax();
             })
         })
    }
    setModalShow = (show) => (e)  => {
        this.props.callService("GET",CONSTANT.PRODUCTS.GET).then(
            res=>{
               this.setState({
                   listProducts:res.data,
                   modal:{show:show}
                }) 
            }).catch(e =>{
                console.error(e)
            })
    } 
    onChange =  (e)  => {
        let { name, value } = e.target;  
        let selectProduct;
        if (name==="name"){
            selectProduct=this.state.listProducts.find(product => product.name === value)
            this.setState({
                unitPrice:selectProduct.price,
                cost:selectProduct.price*this.state.quantity,
                name:value
            }) 
        }
        if(name==="quantity"){
            selectProduct=this.state.listProducts.find(product => product.name === this.state.name)
            this.setState({
                unitPrice:selectProduct.price,
                cost:selectProduct.price*value,
            })
        }
       
        this.setState({ [name] : value }, () => {});
    }
    onclickBack =  (e)  => {
        this.props.setHandlerAction(EDITORDERS,false);
    }
    create = (e)   => {
        let requestOrder = `consumer=${this.state.customer}&date=${this.state.date}&orderNumber=${this.state.orderNumber}&status=${this.state.status}&total=${this.state.totalTaxes}`
        
        //cost=30&name=Chocolate&orderNumber=001-2021&quantity=3&unitPrice=10
        let requestProductOrder;
        this.props.callService("POST",CONSTANT.ORDERS.INSERT+`?${requestOrder}`,{}).then(
          res=>{
              this.state.newListProductsOrder.forEach(x => 
                {
                    requestProductOrder =  `cost=${x.cost}&name=${x.name}&orderNumber=${this.state.orderNumber}&quantity=${x.quantity}&unitPrice=${x.unitPrice}`;
                    this.props.callService("POST",CONSTANT.PRODUCTS.ORDER.INSERT+`?${requestProductOrder}`,{}).then(
                        res=>{            
                                          
                        }).catch(e =>{
                            console.error("Error:",e)
                        })
                })  
                this.props.setHandlerAction(EDITORDERS,false);               
          }).catch(e =>{
              console.error("Error:",e)
          })

    }

    render(){
         return(
             <div>
                 <Form.Group as={Row} className="mb-3" controlId="formHorizontalProduct">

                    <Form.Label column sm={6}><h3>{`Order N° ${this.state.orderNumber}`} </h3></Form.Label>
                    <Col sm={6} style={{textAlign:'right'}}>
                        <Button variant="secondary"  onClick = {this.onclickBack} >Back</Button>
                    </Col>
                    <Form.Label column sm={2}> Customer:</Form.Label>
                    <Col sm={4} >
                        <Form.Control type="text" placeholder="Start Customer" name="customer"  onChange={this.onChange} value={this.state.customer} readOnly={(!this.state.newOrder)}/>
                    </Col>
                    <Col sm={6} ></Col>
                    <Form.Label column sm={2} style={{marginTop:'10px'}}> Status:</Form.Label>
                    <Col sm={4} style={{marginTop:'10px'}}>
                        <Form.Control type="text" placeholder="Start Status" name="status"  value={this.state.status}  readOnly/>
                        
                    </Col>
                    <Col sm={6} ></Col>
                    <Form.Label column sm={2} style={{marginTop:'10px'}}> Date:</Form.Label>
                    <Col sm={4} style={{marginTop:'10px'}}>
                        <Form.Control type="text" placeholder="Start Date" name="date"  value={this.state.date}  readOnly/>
                    </Col>
                    <Col sm={6} ></Col>
                </Form.Group>
                <Row>
                    <Col className="s12 m12 l12" >
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.listProductsOrder.map((productOrder, i) => {     
                                    return (
                                        <tr key={i}>
                                            <td>{i}</td>
                                            <td>{productOrder.name}</td>
                                            <td>{productOrder.quantity}</td>
                                            <td>{`$ ${productOrder.unitPrice}`}</td>
                                            <td>{productOrder.cost}</td>
                                        </tr>
                                    )})
                                }
                            </tbody>
                        </Table> 
                    </Col>
                </Row>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalProduct">
                    <Col sm={12} style={{textAlign:'right'}}>
                        <Button variant="primary"  onClick = {this.setModalShow(true)} >Add Item+</Button>
                    </Col>
                    <Col sm={8} ></Col>
                    <Form.Label column sm={2} style={{textAlign:'right'}}><h4> {`Sub Total: `}</h4> </Form.Label>
                    <Form.Label column sm={2}style={{textAlign:'right'}}><h4> {`${this.state.subtotal}`}</h4></Form.Label>

                    <Col sm={8} ></Col>
                    <Form.Label column sm={2} style={{textAlign:'right'}}><h4> TAXES</h4></Form.Label>
                    <Col sm={2} ></Col>

                    <Col sm={8} ></Col>
                    <Form.Label column sm={2} style={{textAlign:'right'}}>Total City Tax:  </Form.Label>
                    <Form.Label column sm={2}style={{textAlign:'right'}}>{`$ ${this.state.totalCityTax}`}</Form.Label>

                    <Col sm={8} ></Col>
                    <Form.Label column sm={2} style={{textAlign:'right'}}>Total Country Tax:  </Form.Label>
                    <Form.Label column sm={2}style={{textAlign:'right'}}>{`$ ${this.state.totalCountryTax}`}</Form.Label>

                    <Col sm={8} ></Col>
                    <Form.Label column sm={2} style={{textAlign:'right'}}>Total State Tax:  </Form.Label>
                    <Form.Label column sm={2}style={{textAlign:'right'}}>{`$ ${this.state.totalStateTax}`}</Form.Label>

                    <Col sm={8} ></Col>
                    <Form.Label column sm={2} style={{textAlign:'right'}}>Total Federal Tax:  </Form.Label>
                    <Form.Label column sm={2}style={{textAlign:'right'}}>{`$ ${this.state.totalFederalTax}`}</Form.Label>

                    <Col sm={8} ></Col>
                    <Form.Label column sm={2} style={{textAlign:'right'}}><h4>TOTAL TAXES:</h4></Form.Label>
                    <Form.Label column sm={2}style={{textAlign:'right'}}>{`$ ${this.state.totalTaxes}`}</Form.Label>

                    <Col sm={6} ></Col>
                    
                    <Col sm={2} > <Button variant="danger" style={{width:"100%"}} disabled={(!this.state.newOrder)} onClick={this.create}>Create</Button></Col>

                    <Col sm={2} style={{textAlign:'right'}}> <Button variant="danger" style={{width:"100%"}} disabled={(this.state.newOrder)}>Complete Order</Button></Col>
                    <Col sm={2} style={{textAlign:'right'}}><Button variant="danger" style={{width:"100%"}} disabled={(this.state.newOrder)}>Reject Order</Button></Col>
                </Form.Group>                   
                  
                   
                

                <Modal show={this.state.modal.show} onHide={this.setModalShow(false)}>
                    <Modal.Header >
                        <Modal.Title>Add Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalProduct">
                        <Form.Label column sm={2} style={{marginTop:'10px'}}> Name</Form.Label>
                        <Col sm={10} style={{marginTop:'10px'}}>
                            <Form.Control  as="select" placeholder="Start Status" onChange={this.onChange}  name="name" value={this.state.name} >
                                
                                {this.state.listProducts.map((product, i) => {     
                                            return (
                                                <option key={i} value={product.name}>{product.name}</option>
                                            )})
                                }
                            </Form.Control>
                        </Col>

                        <Form.Label column sm={2}  style={{marginTop:'10px'}}> Quantity:</Form.Label>
                        <Col sm={10} style={{marginTop:'10px'}}>
                            <Form.Control type="Number" placeholder="Start Quantity" onChange={this.onChange}  name="quantity"  value={this.state.quantity} />
                            {(this.state.valQuantity)?'':<Form.Text id="valName" style={{color:'red'}}  muted>Required</Form.Text>}
                        </Col>
                        
                        <Form.Label column sm={2} style={{marginTop:'10px'}}> Unit Price:</Form.Label>
                        <Col sm={10} style={{marginTop:'10px'}}>
                            <Form.Control type="text" placeholder="Start Category" onChange={this.onChange}  name="unitPrice" value={this.state.unitPrice} readOnly/>
                        </Col>
                        
                        <Form.Label column sm={2} style={{marginTop:'10px'}}> Cost:</Form.Label>
                        <Col sm={10} style={{marginTop:'10px'}}>
                            <Form.Control type="number" placeholder="Start Price" onChange={this.onChange}  name="cost" value={this.state.cost} readOnly/>
                        </Col>
                            
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.setModalShow(false)}>
                        Close
                    </Button>
                        <Button variant="primary" onClick={this.addItem}>
                            Add Item
                        </Button>
                    </Modal.Footer>
                </Modal>                
                
            </div>
             
        )
    }
}
export default HOC(EditOrders);
