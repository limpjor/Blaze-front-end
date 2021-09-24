import {Component } from 'react';
import { Table, Button,Row,Col} from 'react-bootstrap'; 
import {CONSTANT} from '../../../utils/constant'
import {EDITORDERS,PRODUCTS,ORDER,NEWORDER} from '../../../service/actions'
import HOC from '../../containers/HOC'
import moment from 'moment';


class ListOrders extends Component {
    state={

        listOrders:[],
        modalShow:false
    }
    componentDidMount(){
        this.props.callService("GET",CONSTANT.ORDERS.GET).then(
            res=>{
                this.setState({listOrders:res.data})
            }
        )
    }

    newOrder = (show) => (e)  => {
        let order = this.state.listOrders[this.state.listOrders.length - 1].orderNumber.split('-')
        let number = parseInt(order)+1;
        let orderNumber = "001-"+moment(Date.now()).format('YYYY');
        if(number>9)
            orderNumber=`0${number}-${moment(Date.now()).format('YYYY')}`
        else if(number>99)
            orderNumber=`${number}-${moment(Date.now()).format('YYYY')}`
        else
            orderNumber=`00${number}-${moment(Date.now()).format('YYYY')}`
        this.props.setHandlerAction(PRODUCTS,[]);
        this.props.setHandlerAction(ORDER,{orderNumber:orderNumber,status:"Pending"});
        this.props.setHandlerAction(NEWORDER,true);
        this.props.setHandlerAction(EDITORDERS,true);
    }

    editOrder = (order) => (e)  => {
        this.props.callService("GET",CONSTANT.PRODUCTS.ORDER.GET+`/${order.orderNumber}`).then(
            res=>{
                this.props.setHandlerAction(PRODUCTS,res.data);
                this.props.setHandlerAction(ORDER,order);
                this.props.setHandlerAction(NEWORDER,false);
                this.props.setHandlerAction(EDITORDERS,true);
            }
        )
    }
    render(){    
         return(
             <div>
                <Row>
                    <Col className="s12 m12 l12" >
                        <h1>Orders</h1>
                    </Col>
                </Row>
                <Row>
                    <Col className="s12 m12 l12" style={{textAlign: "right" }}>
                        <Button variant="primary" onClick = {this.newOrder(true)}>Create Order</Button>
                    </Col>
                </Row>
                <Row>
                    <Col className="s12 m12 l12" >
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Consumer</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.listOrders.map((order, i) => {     
                                                return (
                                                    <tr key={i}>
                                                        <td>{order.orderNumber}</td>
                                                        <td>{order.consumer}</td>
                                                        <td>{order.status}</td>
                                                        <td>{order.date}</td>
                                                        <td>{`$ ${order.total}`}</td>
                                                        <td> <Button variant="primary" onClick = {this.editOrder(order)}>Edit</Button></td>
                                                    </tr>
                                                )})
                                }
                            </tbody>
                        </Table>  
                    </Col>
                </Row>    
            </div>
        )
    }
}
export default HOC(ListOrders);
