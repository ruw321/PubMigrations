import React from 'react';
import {
  Table,
  Pagination,
  Select,
  Row,
  Col,
  Divider
} from 'antd'
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";


import MenuBar from '../components/MenuBar';
import { getAllMigrations, getSearchMigrations } from '../fetcher'
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const migrationColumns = [
  {
    title: 'ORCID',
    dataIndex: 'ORCID',
    key: 'ORCID',
    // sorter: (a, b) => a.ORCID.localeCompare(b.ORCID),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'PhdYear',
    dataIndex: 'PhdYear',
    key: 'PhdYear',
    // sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
  },
  {
    title: 'Country2016',
    dataIndex: 'Country2016',
    key: 'Country2016',
    // sorter: (a, b) => a.Rating - b.Rating
    
  },
  // TASK 7: add a column for Potential, with the ability to (numerically) sort ,
  {
    title: 'EarliestYear',
    dataIndex: 'EarliestYear',
    key: 'EarliestYear',
    // sorter: (a, b) => a.Potential - b.Potential
  },
  // TASK 8: add a column for Club, with the ability to (alphabetically) sort 
  {
    title: 'EarliestCountry',
    dataIndex: 'Club',
    key: 'Club',
    // sorter: (a, b) => a.Club.localeCompare(b.Club)
  },
  {
    title: 'HasPhd',
    dataIndex: 'HasPhd',
    key: 'HasPhd'
  },
  {
    title: 'PhdCountry',
    dataIndex: 'PhdCountry',
    key: 'PhdCountry'
  },
  {
    title: 'HasMigrated',
    dataIndex: 'HasMigrated',
    key: 'HasMigrated'
  }

];

class MigrationsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      // matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      playersResults: [],
      pagination: null,

      phdYear: null,
      earliestYear: null,
      hasPhd: null,
      hasMigrated: null,
      migrationsResults: []  
    }

    this.handlePhdYearQueryChange = this.handlePhdYearQueryChange.bind(this)
    this.handleEarliestYearQueryChange = this.handleEarliestYearQueryChange.bind(this)
    this.handleHasPhdQueryChange = this.handleHasPhdQueryChange.bind(this)
    this.handleHasMigratedQueryChange = this.handleHasMigratedQueryChange.bind(this)
    this.updateSearchResults = this.updateSearchResults.bind(this)
  }

  handlePhdYearQueryChange(event) {
    this.setState({ phdYear: event.target.value })
  }

  handleEarliestYearQueryChange(event) {
    this.setState({ earliestYear: event.target.value })
  }

  handleHasPhdQueryChange(value) {
    this.setState({ hasPhd: value })
  }

  handleHasMigratedQueryChange(value) {
    console.log("value here:", value)
    this.setState({ hasMigrated: value })
  }

  updateSearchResults() {
    console.log('phd year: ',this.state.phdYear);
    console.log('earliest year: ',this.state.earliestYear);
    console.log('has phd:' , this.state.hasPhd);
    console.log('has migrated:', this.state.hasMigrated);
    //TASK 11: call getMatchSearch and update matchesResults in state. See componentDidMount() for a hint
    getSearchMigrations(this.state.phdYear, this.state.earliestYear, this.state.hasPhd, this.state.hasMigrated,
      null, null).then( res => {
        this.setState({ migrationsResults: res.results })
    })
    console.log('done with updating search results');

  }

  componentDidMount() {

    getAllMigrations().then(res => {
      console.log(res.results)
      this.setState({ migrationsResults: res.results})
    })
  }

  render() {
    return (
      <div>
      <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>PhD Year</label>
                    <FormInput placeholder="phdYear" value={this.state.phdYear} onChange={this.handlePhdYearQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Earliest Year</label>
                    <FormInput placeholder="earliestYear" value={this.state.earliestYear} onChange={this.handleEarliestYearQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Has PhD</label>
                    <Select defaultValue="True" options={[{label:"True", value:1},{label:"False", value:0}]} onChange={this.handleHasPhdQueryChange}></Select>
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Has Migrated</label>
                    {/* <FormInput placeholder="hasMigrated" value={this.state.hasMigrated} onChange={this.handleHasMigratedQueryChange} /> */}
                    <Select defaultValue="True" options={[{label:"True", value:1},{label:"False", value:0}]} onChange={this.handleHasMigratedQueryChange}></Select>
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                    <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                </FormGroup></Col>
            </Row>
        </Form>
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Migrations</h3>
        <Table dataSource={this.state.migrationsResults} columns={migrationColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      </div>
    </div>
    )
  }
}

export default MigrationsPage


