import React, { useEffect, useState, useRef, useMemo, createRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'; 
import Chart from 'chart.js/auto';
//import './PostesProduit.css';








const initialData = {
  Combustibles: {scope1: 0,scope2: 0,scope3: 0},
  ProcessEmissionsFugitives: {scope1: 0,scope2: 0,scope3: 0 },
  UTCF: {scope1: 0,scope2: 0,scope3: 0 },
  Electricite: {scope1: 0,scope2: 0,scope3: 0 },
  AchatsBiens: {scope1: 0,scope2: 0,scope3: 0 },
  AchatsServices: {scope1: 0,scope2: 0,scope3: 0 },
  TransportMarchandises: {scope1: 0,scope2: 0,scope3: 0 },
  TransportPersonnes: {scope1: 0,scope2: 0,scope3: 0 },
  TraitementDechets: {scope1: 0,scope2: 0,scope3: 0 },
};

const PostesProduit = React.memo(function PostesProduit({formResults}) {


  let isSubmitted = localStorage.getItem('isSubmitted');
  if (isSubmitted === 'true') {
    isSubmitted = true;
  } else {
    isSubmitted = false;
  }

let storedFormResults = formResults;

if (!localStorage.getItem('formResults')) {
  // Key doesn't exist, create it and set initial value
  const initialFormResults = [{
    secteur1: '',
    secteur2: '',
    secteur3: '',
    secteur4: '',
    secteur5: '',
    nom: '',
    ligne: '',
    poste: '',
    quantite: '',
    unite: '',
    NomAttribut: '',
    NomFrontiere: '',
    contributeur: '',
    localisation: '',
    souslocalisation: ''
  }];

  // Convert to JSON and set in local storage
  localStorage.setItem('formResults', JSON.stringify(initialFormResults));

  // Set storedFormResults to the initial value if it doesn't exist in props
  storedFormResults = initialFormResults;
} else {
  // Retrieve the stored value from local storage
  storedFormResults = JSON.parse(localStorage.getItem('formResults'));
}

  const secteur1Array = useMemo(() => storedFormResults.map(result => result.secteur1.trim()).filter(secteur1 => secteur1 !== ''), [storedFormResults]);


  const [dataByCategory, setDataByCategory] = useState(initialData);

  

  const sectorMapping = useMemo(() => ({
    'Combustibles': 'Combustibles',
    'Process et émissions fugitives': 'ProcessEmissionsFugitives',
    'UTCF': 'UTCF',
    'Electricité': 'Electricite',
    'Achats de biens': 'AchatsBiens',
    'Achats de services': 'AchatsServices',
    'Transport de marchandises': 'TransportMarchandises',
    'Transport de personnes': 'TransportPersonnes',
    'Traitement des déchets': 'TraitementDechets',
    '': ''
  }), []);


  const sectorDeMapping = useMemo(() => ({
    'Combustibles': 'Combustibles',
    'ProcessEmissionsFugitives': 'Process et émissions fugitives',
    'UTCF': 'UTCF',
    'Electricite': 'Electricité',
    'AchatsBiens': 'Achats de biens',
    'AchatsServices': 'Achats de services',
    'TransportMarchandises': 'Transport de marchandises',
    'TransportPersonnes': 'Transport de personnes',
    'TraitementDechets': 'Traitement des déchets',
    '': ''
  }), []);

  
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    let newLabels = [];

    storedFormResults.forEach((storedFormResults, index) => {
      let formLabels = [];

      for (let key in storedFormResults) {
        if (key.startsWith('secteur')) {
          formLabels.push(storedFormResults[key]);
        }
      }

      newLabels.push(formLabels.join(' > '));
    });

    setLabels(newLabels);
  }, []); 




    useEffect(() => {

      const fetchData = async () => {
        try {
          const newDataByCategory = { ...dataByCategory };
          for (const secteur1Value of secteur1Array) {
            const trimmedSecteur1Value = secteur1Value.trim();
            const mappedSector = sectorMapping[trimmedSecteur1Value];
            if (!mappedSector) {
              console.warn('Mapped sector not found for:', trimmedSecteur1Value);
              continue; 
            }
    
            const response1 = await axios.get(`http://localhost:3001/scopes/getScope1?sector1=${trimmedSecteur1Value}`);
            const response2 = await axios.get(`http://localhost:3001/scopes/getScope2?sector1=${trimmedSecteur1Value}`);
            const response3 = await axios.get(`http://localhost:3001/scopes/getScope3?sector1=${trimmedSecteur1Value}`);
   
              newDataByCategory[mappedSector] = {
                ...newDataByCategory[mappedSector],
                scope1: newDataByCategory[mappedSector].scope1 + response1.data.scope1,
                scope2: newDataByCategory[mappedSector].scope2 + response2.data.scope2,
                scope3: newDataByCategory[mappedSector].scope3 + response3.data.scope3
              };
    
          }
          setDataByCategory(newDataByCategory);
        } catch (error) {
          console.error('Error fetching data for stats:', error);
        } finally {
        }
      };
      fetchData();
    }, []);



const generateColors = (num) => {
  // Generate colors logic
  return Array.from({ length: num }, () => "#" + Math.floor(Math.random() * 16777215).toString(16));
};


const ChartComponent = ({ secteur, dataByCategory, secteur1Array }) => {
  const chartRef = useRef(null);

  useEffect(() => {
      const backgroundColors = generateColors(3); // Assuming always 3 scopes (scope1, scope2, scope3)
      const borderColors = generateColors(3);
      let dataSet = dataByCategory[sectorMapping[secteur]];
   
      if (!(dataSet.scope1 === 0 && dataSet.scope2 === 0 && dataSet.scope3 === 0) && chartRef.current !== null) {
        const ctx = chartRef.current.getContext('2d');

        const myChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Scope 1", "Scope 2", "Scope 3"],
            datasets: [
              {
                label: `Pourcentage des 3 scopes / Produits`,
                data: dataSet ? [(dataSet.scope1 * 100) / (dataSet.scope1 + dataSet.scope2 + dataSet.scope3),  (dataSet.scope2 * 100) / (dataSet.scope1 + dataSet.scope2 + dataSet.scope3), (dataSet.scope3 *100) / (dataSet.scope1 + dataSet.scope2 + dataSet.scope3)] : [0, 0, 0], 
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
              },
            ],
          },
          options: {
            borderRadius: 2,
            cutout: "50%",
            radius: "37%",
            plugins: {
              legend: {
                display: true,
                position: "right",
                align: "center",
              },
            },
          },
        });

        return () => {
          myChart.destroy();
        };
      } 
      
  }, [secteur1Array, dataByCategory, secteur]);

  return (
    <div>
          <canvas ref={chartRef}></canvas>
    </div>
  );
};


return (
  <div>
    {secteur1Array.map((secteur, index) => (
      <div>
        <h3>{labels[index]}</h3>
        <ChartComponent key={index} dataByCategory={dataByCategory} secteur={secteur} />
        </div>
    ))}
</div>
);
});

PostesProduit.propTypes = {
  formResults: PropTypes.array.isRequired
};

export default PostesProduit;
