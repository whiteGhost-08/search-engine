import React, {useState, useEffect,useRef} from "react";
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';


import './App.css';



function App() {
  const [formState, setFormState] = useState('IN_PROGRESS');
  const [query,setQueryState]=useState('');
  const [model,setModelState]=useState('BM25');
  const [resultNo,setResultNoState]=useState('');
  const [result,setResultState]=useState('');
  const queryRef=useRef('');
  const modelRef=useRef('');
  const resultNoRef=useRef('');

  const handleSubmission = () => {
    setQueryState(queryRef.current.value);
    setModelState(modelRef.current.value);
    setResultNoState(resultNoRef.current.value);
    if (query&&model&&resultNo) {
      setFormState('FETCHING_DATA');
    }
  }

 useEffect(() => {
    if (formState === 'FETCHING_DATA') {
      axios.post(
        `http://localhost:5000/submit`,{ one:query , two:model , three:resultNo ,}
      ).then(res => {
        console.log(res);
        setFormState('DONE');
        setResultState(res.data);
      }).catch(error => {
        setFormState('ERROR');
        console.log(error);
      });
    }
  }, [formState]);

  if(formState==='IN_PROGRESS')
  {
    //return simple form page
    // return(
    //   <>
    //   <TextField id="outlined-basic" label="Outlined" variant="outlined" inputRef={queryRef} />
    //   <TextField id="outlined-basic" label="Outlined" variant="outlined" inputRef={modelRef}/>
    //   <TextField id="outlined-basic" label="Outlined" variant="outlined" inputRef={resultNoRef}/>
    //   <Button
    //       onClick={handleSubmission}
    //       variant="contained"
    //       style={{width: "32ch"}}
    //     > Submit </Button>
    //   </>
    // )
    return (
      

       <Box
        component="form"
        sx={{
          '& > :not(style)': {m: 1, width: '25ch'},
        }}
        className="codeforces-id-input"
      >
      

        <TextField
          InputLabelProps={{style : {color : 'red'} }}
          id="Query"
          label="Query" 
          inputRef={queryRef}
        />
        <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Model</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    inputRef={modelRef}
    //value={age}
    label="Age"
    //onChange={handleChange}
  >
    <MenuItem value="BM25">BM-25</MenuItem>
    <MenuItem value="TFIDF">TF-IDF</MenuItem>
  </Select>
</FormControl>
        <TextField
          InputLabelProps={{style : {color : 'red'} , shrink:true}}
          id="resultNo"
          label="Results No"
          type="number"
          inputRef={resultNoRef}
        />
        <Button
          onClick={handleSubmission}
          variant="contained"
          style={{width: "32ch"}}
        >
          Submit
        </Button>
      </Box> 
);}
  else
  {
    if(formState==='FETCHING_DATA')
    {
      return (
        <div className="codeforces-id-input">
          <Typography variant="h5" component="div" color="Black" gutterBottom>
            Loading data for {query}
          </Typography>
          <Box sx={{ width: '50%'}}>
            <LinearProgress />
          </Box> 
        </div>
      );
    }
  }
  
  return (
		<div className="App">
			<div className="results">
				{result.map((res, i) => {
					const url = `${res.URL}`;
					return (
						<div className="result" key={i}>
							<h3>{res.Title}</h3>
							<p dangerouslySetInnerHTML={{ __html: res.Summary  }}></p>
							<a href={url} target="_blank" rel="noreferrer">Read more</a>
						</div>
					)
				})}
			</div>
		</div>
	);
}

export default App;
