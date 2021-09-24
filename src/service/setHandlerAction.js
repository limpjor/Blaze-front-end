export const setHandler = (handlerAction,res) => async dispatch =>{
    try{
        dispatch(handlerAction(res));
    } catch (error) {
        console.log(error);
    }
}