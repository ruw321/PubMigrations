import React from 'react';
import {
  Table,
  Select,
  Row,
  Col,
  Spin,
  Space
} from 'antd'
import { Form, FormInput, FormGroup, Button } from "shards-react";

import MenuBar from '../components/MenuBar';
import { getAllMigrations, getSearchMigrations } from '../fetcher'

class MigrationsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesPageNumber: 1,
      matchesPageSize: 10,
      playersResults: [],
      pagination: null,
      loadingMigrations: true,

      phdYear: "",
      earliestYear: "",
      hasPhd: 1,
      hasMigrated: 1,
      migrationsResults: [],
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
    this.setState({ hasMigrated: value })
  }

  updateSearchResults() {
    this.setState({ loadingMigrations: true })
    // console.log('state:', this.state);
    // console.log('phd year: ',this.state.phdYear);
    // console.log('earliest year: ',this.state.earliestYear);
    // console.log('has phd:' , this.state.hasPhd);
    // console.log('has migrated:', this.state.hasMigrated);

    getSearchMigrations(this.state.phdYear, this.state.earliestYear, this.state.hasPhd, this.state.hasMigrated,
      null, null).then( res => {
        this.setState({ migrationsResults: res.results })
        this.setState({ loadingMigrations: false })
    })
    // console.log('done with updating search results');
  }

  componentDidMount() {
    getAllMigrations().then(res => {
      this.setState({ migrationsResults: res.results})
      this.setState({ loadingMigrations: false })
    })
  }

  render() {
    if (window.localStorage.getItem('Authenticated') !== 'True') {
      // go back to the login page since you are not authenticated
      window.location = '/login';
    }
    const migrationColumns = [
      {
        title: 'ORCID',
        dataIndex: 'ORCID',
        key: 'ORCID',
        sorter: (a, b) => a.ORCID.localeCompare(b.ORCID),
        render: (_, record) => (
          <Space size="middle">
            <a href= {`https://orcid.org/${record.ORCID}`}> {record.ORCID} </a>
          </Space>
        )
      },
      {
        title: 'PhdYear',
        dataIndex: 'PhdYear',
        key: 'PhdYear',
        sorter: (a, b) => a.PhdYear - b.PhdYear
      },
      {
        title: 'Country2016',
        dataIndex: 'Country2016',
        key: 'Country2016',
        sorter: (a, b) => a.Country2016.localeCompare(b.Country2016)    
      },
      {
        title: 'EarliestYear',
        dataIndex: 'EarliestYear',
        key: 'EarliestYear',
        sorter: (a, b) => a.EarliestYear - b.EarliestYear    
      },
      {
        title: 'EarliestCountry',
        dataIndex: 'EarliestCountry',
        key: 'EarliestCountry',
        sorter: (a, b) => a.EarliestCountry.localeCompare(b.EarliestCountry)
      },
      {
        title: 'HasPhd',
        dataIndex: 'HasPhd',
        key: 'HasPhd',
        sorter: (a, b) => a.HasPhd - b.HasPhd    
      },
      {
        title: 'PhdCountry',
        dataIndex: 'PhdCountry',
        key: 'PhdCountry',
        sorter: (a, b) => a.PhdCountry.localeCompare(b.PhdCountry)
      },
      {
        title: 'HasMigrated',
        dataIndex: 'HasMigrated',
        key: 'HasMigrated',
        sorter: (a, b) => a.HasMigrated - b.HasMigrated    
      }
    ];

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
      <MenuBar />
      <div>
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                    <label>PhD Year</label>
                    <FormInput type="number" placeholder="phdYear" value={this.state.phdYear} onChange={this.handlePhdYearQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                    <label>Earliest Year</label>
                    <FormInput type="number" placeholder="earliestYear" value={this.state.earliestYear} onChange={this.handleEarliestYearQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                    <label>Has PhD</label>
                    <Select style={{ width: '15vw', margin: '0 auto' }} defaultValue="True" options={[{label:"True", value:1},{label:"False", value:0}]} onChange={this.handleHasPhdQueryChange}/>
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                    <label>Has Migrated</label>
                    <Select style={{ width: '15vw', margin: '0 auto' }} defaultValue="True" options={[{label:"True", value:1},{label:"False", value:0}]} onChange={this.handleHasMigratedQueryChange}/>
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                    <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                </FormGroup></Col>
            </Row>
        </Form>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Migrations</h3>
          <h6> Search migration table for whether a researcher has migrated and when they got their PhD (if applicable)</h6>
          <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning:this.state.loadingMigrations}} rowKey="ORCID" dataSource={this.state.migrationsResults} columns={migrationColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        </div>
      </div>
    </div>
    )
  }
}

export default MigrationsPage


