import useDepense from "../hooks/UseDepense";
// src : https://js.devexpress.com/React/Demos/WidgetsGallery/Demo/Charts/StandardBar/FluentBlueLight/
import { Chart, Series } from "devextreme-react/chart";

function graphiquePageEnveloppe() {
  const { depenses, loading, error } = useDepense();

  //Could be changed to a spinner or a cuter message
  if (loading) return <div>Chargement...</div>;

  if (error) return <div>Erreur: {error}</div>;

  if (depenses.length === 0)
    return <div>Vous n'avez présentement aucune dépense. </div>;
  return (
    <Chart id="chart" dataSource={depenses}>
      <Series
        valueField="prix"
        argumentField="date"
        name="Mes dépenses de la semaine"
        type="bar"
        color="var(--secondary-color)"
      />
    </Chart>
  );
}

export default graphiquePageEnveloppe;
