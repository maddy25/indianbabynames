import React from "react";
import { render } from "react-dom";
import { makeGirlData, makeBoyData,Tips,Tips2,onRowClick } from "./Utils";
import matchSorter from 'match-sorter';
import * as FontAwesome from 'react-icons/lib/fa';
import _ from 'lodash';
import * as ReactBootstrap from 'react-bootstrap/lib/';
import Modal from 'react-responsive-modal';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class App extends React.Component {
    
    
  constructor() {
    super();
    document.body.style.backgroundColor = "#ffd3d9";
            var that = this;
    this.state = {
    data: makeGirlData(),
    isFavorite:<FontAwesome.FaHeartO />,
    fullHeart:<FontAwesome.FaHeart/>,
    open: false,
    favList:null

  };
      this.favList = "";
      var favList = "";

  this.onOpenModal = () => {
            
      this.setState({ open: true });

  };
 
  this.onCloseModal = () => {
    this.setState({ open: false });
  };

  

  var open  = this.state.open;
  const styles = {
    fontFamily: "sans-serif",
    textAlign: "center"
  };
      
      let count = 0;
    this.renderCell = function(row) {
        var allEntries = [];
        allEntries = JSON.parse(localStorage.getItem("allEntries")) || [];
        var isAllEntriesEmpty = _.find(allEntries,function(o) {
            return o.name===row.original.Name
        })
            if (isAllEntriesEmpty) {
                row.original.favorite = <FontAwesome.FaHeart/>;
                row.original.isFavorite = false;     
            } else if (row.original.favorite==undefined) {
                row.original.favorite = <FontAwesome.FaHeartO/>;
                row.original.isFavorite = true;
            } 
            return <div onClick={this.onTextClick.bind(this, row)}>{row.original.favorite}&nbsp;</div>;
            
    };
    this.onTextClick = function(row) {
        var allEntries = [];
        allEntries = JSON.parse(localStorage.getItem("allEntries")) || [];
        if(row.original.favorite===undefined || row.original.isFavorite) {
                    row.row.favorite = true;
                    row.original.favorite = <FontAwesome.FaHeart/>;
                    row.original.isFavorite = false;
                    console.log(row);
            this.setState({isFavorite:<FontAwesome.FaHeart/>});
           var myFavs = {
                "name":row.original.Name,
                "meaning":row.original.Meaning
           };
            
            allEntries.push(myFavs);
            allEntries = _.uniqBy(allEntries, 'name');
            localStorage.setItem("allEntries", JSON.stringify(allEntries));
                        console.log(allEntries);

        } else if (!row.original.isFavorite) {
            row.original.favorite = <FontAwesome.FaHeartO/>;
            row.original.isFavorite  = true;
            console.log(row);
            allEntries = JSON.parse(localStorage.getItem("allEntries"))
            var myNotFavs = {
                "name":row.original.Name,
                "meaning":row.original.Meaning
           };
            allEntries = _.reject(allEntries, function(o) { return o.name==row.original.Name; });
            localStorage.setItem("allEntries", JSON.stringify(allEntries));
            console.log(allEntries)
        }
    }

  };
    setGender(event) {
    if(event.target.value === "Girl"){
        document.body.style.backgroundColor = "#ffd3d9"
        this.setState({data:makeGirlData()});

    } else {
        document.body.style.backgroundColor = "lightblue"
        this.setState({data:makeBoyData()});

    };
  };
  render() {
    const { data } = this.state;
      const isFavorite = this.state.isFavorite;
      const fullHeart = this.state.fullHeart;
      let that = this;
      var arrList = [];
      
      
    return (
      <div>
        <div onChange={this.setGender.bind(this)} style={{ textAlign: "center" ,padding:"65px"}}>
            
        <span className="col-md-6"><input type="radio" value="Girl" defaultChecked name="gender"/> Girl</span>
        <span className="col-md-6"><input type="radio" value="Boy" name="gender"/> Boy</span>
            <ReactBootstrap.Button bsStyle="success" onClick={this.onOpenModal}>Show <FontAwesome.FaHeart/></ReactBootstrap.Button>
        
        <Modal open={this.state.open} onClose={this.onCloseModal} little={true} closeIconSize={20}>
            <h2 style={{textAlign:"center"}}><FontAwesome.FaHeart/></h2>
            <div>
                
            <ReactTable
          data={JSON.parse(localStorage.getItem("allEntries"))}
          columns={[{
              Header: 'Name',
              accessor: 'name'
          },
                   {
              Header: 'Meaning',
              accessor: 'meaning'
          }]}
            defaultPageSize={10} minRows={0}
            showPagination={false}
        
          className="-striped -highlight"
    />
            </div>
          
        </Modal>
     

    
      </div>
        <ReactTable
        filterable
        getTdProps={onRowClick}
          data={data}
          columns={[{
    Header: 'Name',
    accessor: 'Name' ,// String-based value accessors!
    filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["Name"] }),
   filterAll: true
  }, {
    Header: 'Meaning',
    accessor: 'Meaning',
        filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["Meaning"] }),
   filterAll: true
  },
   {
       Header: 'Add to Favorites',
       accessor:'favorite',
       filterable:false,
       Cell: (row) => this.renderCell(row)
  }
    
    ]}
        defaultSorted={[
            {
              id: "Name",
              asc: true
            }
          ]}
          defaultPageSize={10} minRows={0}
            
        
          className="-striped -highlight"
        />
        <br />
              <Tips/>
              <Tips2/>
    
      </div>
    );
  }
}
render(<App />, document.getElementById("root"));



