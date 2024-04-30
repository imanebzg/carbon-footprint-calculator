
import Avancement from "../../Componenets/Avancement_exmp/Avancement_exmp"
import Info_entreprise from "../../Componenets/Info_entreprise/Info_entreprise"
import Notif from "../../Componenets/Notifications/Notifications"
import Postes from "../../Componenets/Postes/Postes"
import Rapport from "../../Componenets/Rapport_det/Rapport_det"
import Security from "../../Componenets/Securite/Securite"
import Supprimer from "../../Componenets/Supprimer/Supprimer"
import Histogrm_s from "../../Componenets/histogrm/histogrm"
import Histogrm_T from "../../Componenets/histogrm-total/TOTAL"
import Info from "../../Componenets/info_personel/Info_personel"
import Sdb from "../../Componenets/Sidebar/Sidebar"
import Tableau from "../../Componenets/tableau/tableau"


const Thirdpage = (props) => {
  
  
    return (

        <div > 


           <Avancement/>
           <Info_entreprise/>
           <Notif/>
           <Postes/>
           <Rapport/>
           <Security/>
           <Supprimer/>
           <Info/>
           <Histogrm_s/> 
           <Histogrm_T/>          
        </div>
      );
}
export default Thirdpage;
 