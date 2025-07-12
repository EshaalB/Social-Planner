import './App.css' 

import Layout from './layouts/Layout'
import Content from './pages/Content'
const loading = false;
function App() {  
   
  return (
    <>
   {loading ? <div>Loading...</div> : (
     <Layout>
      <Content />
     </Layout>
   )}
    
    </>
  )
}

export default App // this is how you export the app
