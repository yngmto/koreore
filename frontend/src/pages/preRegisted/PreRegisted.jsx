import "./PreRegisted.css";
import Topbar from '../../components/topbar/Topbar';
import Footer from '../../components/footer/Footer';

export default function PreRegisted() {
    return (<>
        <Topbar />
        <div className='preRegisterContainer'>
                <h1>仮登録完了</h1>
                <div className="preRegistedMessage">
                    認証用のメールを送信しました。
                    24時間以内に、メール記載のURLから本登録にお進みください。
                </div>
        </div>
        <Footer />
    </>
    )
}