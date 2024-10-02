import "./PreUserExist.css";
import Topbar from "../../components/topbar/Topbar";
import Footer from "../../components/footer/Footer";

export default function PreUserExist() {
    return (<>
        <Topbar />
        <div className="registerContainer">
                <div className="registedMessage">
                    既に認証用メールをお送りしておりますので、記載のURLからアドレスの認証をお願いいたします。
                </div>
        </div>
        <Footer />
    </>
    )
}