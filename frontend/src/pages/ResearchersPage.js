import React from 'react';
import {
  Table,
  Row,
  Col,
  Spin,
} from 'antd'
import { Form, FormInput, FormGroup, Button } from "shards-react";

import MenuBar from '../components/MenuBar';
import { getResearchers } from '../fetcher'

const researchersColumns = [
  {
    title: 'ANDID',
    dataIndex: 'ANDID',
    key: 'ANDID',
    sorter: (a, b) => a.ANDID - b.ANDID
  },
  {
    title: 'LastName',
    dataIndex: 'LastName',
    key: 'LastName',
    sorter: (a, b) => a.LastName.localeCompare(b.LastName)
  },
  {
    title: 'Initials',
    dataIndex: 'Initials',
    key: 'Initials',
    sorter: (a, b) => a.Initials.localeCompare(b.Initials)
  },
  {
    title: 'BeginYear',
    dataIndex: 'BeginYear',
    key: 'BeginYear',
    sorter: (a, b) => a.BeginYear - b.BeginYear
  },
  {
    title: 'Employment',
    dataIndex: 'Employment',
    key: 'Employment',
    sorter: (a, b) => a.Employment.localeCompare(b.Employment)
  },
  {
    title: 'Education',
    dataIndex: 'Education',
    key: 'Education',
    sorter: (a, b) => a.Education.localeCompare(b.Education)
  },
  {
    title: 'Papers',
    dataIndex: 'Papers',
    key: 'Papers',
  }
];

class ResearchersPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesPageNumber: 1,
      matchesPageSize: 10,
      pagination: null,
      loadingResearchers: false,

      education: '',
      employment: '',
      researchersResults: []
    }

    this.handleEmploymentChange = this.handleEmploymentChange.bind(this);
    this.handleEducationChange = this.handleEducationChange.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);

  }

  handleEmploymentChange(event) {
    this.setState({ employment: event.target.value });
  }

  handleEducationChange(event) {
    this.setState({ education: event.target.value });
  }

  updateSearchResults() {

    if (this.state.employment === '' || this.state.education === '') {
      alert("Employment and Education are required");
    } else {
      this.setState({ loadingResearchers: true });
      getResearchers(this.state.employment, this.state.education).then(res => {
        this.setState({ researchersResults: res.results });
        this.setState({ loadingResearchers: false });
      })
    }

  }

  render() {
    if (window.localStorage.getItem('Authenticated') !== 'True') {
      // go back to the login page since you are not authenticated
      window.location = '/login';
    }
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <MenuBar />
        <div>
          <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Employment (required)</label>
                <FormInput placeholder="Employment" value={this.state.employment} onChange={this.handleEmploymentChange} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Education (required)</label>
                <FormInput placeholder="Education" value={this.state.education} onChange={this.handleEducationChange} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
              </FormGroup></Col>
            </Row>
          </Form>
          <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
            <h3>Researchers</h3>
            <h6> Get researcher information based on employment and education</h6>
            <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning: this.state.loadingResearchers }} rowKey="ANDID" dataSource={this.state.researchersResults} columns={researchersColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 10, showQuickJumper: true }} />
          </div>
        </div>
      </div>
    )
  }
}

export default ResearchersPage

