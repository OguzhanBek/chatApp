import { IoChatbubbleEllipses } from "react-icons/io5";
function Home() {
  //BU component chat kısmı boşsa kullanılacak
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div>
        <IoChatbubbleEllipses size={24} />
      </div>
      <p>Yeni sohbet için birini ekleyin ve üzerine tıklayın.</p>
    </div>
  );
}
export default Home;
