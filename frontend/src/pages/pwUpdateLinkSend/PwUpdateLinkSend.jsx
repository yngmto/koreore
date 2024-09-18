import "./PwUpdateLinkSend";
import Topbar from '../../components/topbar/Topbar';
import Footer from '../../components/footer/Footer';

export default function PwUpdateLinkSend() {
    return (<>
        <Topbar />
        <div className='preRegisterContainer'>
                <h1>メール送信完了</h1>
                <div className="preRegistedMessage">
                    お送りしたメールに記載のURLからパスワードを更新してください。
                    有効期限は24時間です。
                </div>
        </div>
        <Footer />
    </>
    )
}