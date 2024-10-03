import "./Registered.css";
import Topbar from "../../components/topbar/Topbar";
import Footer from "../../components/footer/Footer";

export default function Registered() {
    return (<>
        <Topbar />
        <div className="registerContainer">
                <div className="registedMessage">
                    このメールアドレスは既に登録されています。
                </div>
        </div>
        <Footer />
    </>
    )
}