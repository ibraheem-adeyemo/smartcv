import "../css/createBank.css";
import RegisterThumbNails from "./common/RegisterThumbNails";
import TopHeader from "./common/TopHeader";
const CreateBankPage = () => {
  return (
    <div className="mainbody">
      <TopHeader></TopHeader>
      <RegisterThumbNails
        one="tnCircleActive"
        headerOne="tnHeaderActive"
        two="tnCircleNoFocus"
        headerTwo="tnHeaderNoFocus"
        three="tnCircleNoFocus"
        headerThree="tnHeaderNoFocus"
        lines="hidden"
      ></RegisterThumbNails>

      <form className="formBank">
        <h3>Create bank</h3>
      </form>
    </div>
  );
};

export default CreateBankPage;
