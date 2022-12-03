import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import Login from "../Login/Login";
import TableauBord from "../TableauBord/TableauBord";
import CreerProjets from "../Projets/CreerProjets";
import Membres from "../Membres/Membres";
import CreerClient from "../Client/CreerClient";
import DetailsClient from "../Client/DetailsClient";
import Projets from "../Projets/Projets"
import ModifierProjets from "../Projets/ModifierProjets"
import DetailsProjets from "../Projets/DetailsProjets"
import DetailsAjouter from "../Projets/DetailsAjouter"
import { authContexte } from "../../Contexte/authContexte";
import { useContext } from "react";
import Clients from "../Client/Client";


const App = () =>{
  const ctx = useContext(authContexte);
  console.log(ctx.isLoading);
  const routes = !ctx.isLoading && ctx.user ? [
	{
	  path: "/",
	  element: <Layout />,
      children: [
		{
		  index: true,
		  element: <Navigate to="/accueil" replace />,
		},
		{
		  path: "accueil",
		  element: <TableauBord />,
		},
    {
      path: 'projets',
      element: <Projets />,
    },{
      path: 'projets/:projetId',
      element: <DetailsProjets/>,
      children:[{
      path: ':modifier',
      element: <ModifierProjets/>,
      }]
    },{
      path: 'projetsadded/:projetId',
      element: <DetailsAjouter/>,
    },
    {
      path: 'creerprojet',
      element: <CreerProjets/>
    },
    {
      path: 'membres',
      element: <Membres/>
    },
    {
      path: 'creerprojet',
      element: <CreerProjets/>
    },
    {
      path: 'creerClient',
      element: <CreerClient/>
    },
    {
      path: 'clients',
      element: <Clients/>,
      children: [
        {
          path: ':clientId',
          element: <DetailsClient/>,
        },
      ],
    }
	  ]
	},
	{
	  path: "*",
	  element: <Navigate to="/" replace />,
	},
  ] : [
        {
          path: "/",
          element: <Layout />,
          children: [
            {
              index: true,
              element: <Navigate to="/login" replace />,
            },
            {
              path: "login",
              element: <Login />,
            }
          ],
        },
        {
          path: "*",
          element: <Navigate to="/login" replace />,
        }
      ];


  return (
    <RouterProvider router={createBrowserRouter(routes)}/>
  );
}
export default App;