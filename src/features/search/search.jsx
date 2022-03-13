import React, { useEffect } from 'react'
import DishCard  from '../restaurant/dishCard'
import { IconButton, TextField } from '@material-ui/core';
import {  Clear, SearchOutlined } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import {  selectrestaurant } from '../restaurant/restaurantSlice';
import { selectcurrentMenu, setCurrent } from '../bottomNav/bottomSlice';
// import { SearchClient as TypesenseSearchClient } from "typesense";
import { InstantSearch, Hits, Configure } from "react-instantsearch-dom"
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter"
import { createConnector, connectStateResults } from 'react-instantsearch-dom';

const convert = (t) => { 
  for (var key in t){
      try{
        t[key] = JSON.parse(t[key])
      }
      catch(err){
        
      }
    }
  return t
}

export default function TypesenseSearch() {
  const restaurant = useSelector(selectrestaurant)
  const dispatch = useDispatch()
  const currentType = useSelector(selectcurrentMenu)
  useEffect(() => {
    dispatch(setCurrent('search'))
}, [])
  const Hit = ({ hit }) => {
    const dish = convert(hit)
    return(
      <React.Fragment key={dish.dish_id}>
        <DishCard dish={{...dish,images:[dish.image]}} filter={[]} />
      </React.Fragment>
  )
}

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "Eksb8SAIEYXiEhndyYJrI5YaFlUydHVI", // Be sure to use a Search API Key
    nodes: [{
      'host': 'zl04bsu67g1dmjotp-1.a1.typesense.net', // where xxx is the ClusterID of your Typesense Cloud cluster
      'port': '443',
      'protocol': 'https'
    }],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  additionalSearchParameters: {
    queryBy: "dish_name,description,search_tags",
    per_page:30,
    // filter_by:`restaurant_id: ${restaurant.restaurantId}`,
    // group_by:`category`
  },
})
  var filterForm = [`restaurant_id: ${restaurant.restaurantId}`,]
  if(currentType){
    filterForm.push(`type:${currentType}`)
  }
  const facetFilters = React.useMemo(() => filterForm, [restaurant.restaurantId])
  
  return (
    <div>
      <InstantSearch searchClient={typesenseInstantsearchAdapter.searchClient} indexName="dishes"  >
        <ConnectedSearchBox  />
        {/* <Stats /> */}
        <Configure 
        facetFilters={facetFilters} 
        filters="published:true"
        />
        {/* <RefinementList
          attribute={'category'}
        /> */}
          <Hits hitComponent={Hit} />
          <Results>
          </Results>
      </InstantSearch>
    </div> 
  )
}

const Results = connectStateResults(({ searchState,children }) => 
  (!searchState || !searchState.query) && (
    <div>Type something to search...
    </div>
  )
);


const connectWithQuery = createConnector({
  displayName: 'WidgetWithQuery',
  getProvidedProps(props, searchState) {
    const currentRefinement = searchState.attributeForMyQuery || null;
    return { currentRefinement };
  },
  refine(props, searchState, nextRefinement) {
    return {
      ...searchState,
      attributeForMyQuery: nextRefinement,
    };
  },
  getSearchParameters(searchParameters, props, searchState) {
    
    return searchParameters.setQuery(searchState.attributeForMyQuery || null);
  },
  cleanUp(props, searchState) {
    const { attributeForMyQuery, ...nextSearchState } = searchState;

    return nextSearchState;
  },
});

const MySearchBox = ({ currentRefinement, refine,cleanUp }) => {
  return(
    <TextField 
      placeholder='search' 
      onFocus={(e) => e.target.placeholder = ""} 
      onBlur={(e) => e.target.placeholder = "search"}
      value={currentRefinement}
      onChange={e => refine(e.currentTarget.value)}
      InputProps={{
        disableUnderline:true,
        className:'onmenu-input',
        style:{width:'100%'},
        startAdornment:<SearchOutlined style={{color:'#a0a0a0',marginRight:8}} />,
        endAdornment:currentRefinement?
        <IconButton 
        size='small' 
        style={{marginLeft:-4}} 
        onClick={(e) =>{
          refine('')
        }}
        >
          <Clear />
        </IconButton>
        :null
      }}
      />
)};

const ConnectedSearchBox = connectWithQuery(MySearchBox);