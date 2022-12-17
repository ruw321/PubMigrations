import React from 'react';
import {
  Table,
  Spin,
  Row,
  Col,
  Slider,
} from 'antd'
import { Form, FormGroup, Button } from "shards-react";

import MenuBar from '../components/MenuBar';
import { getMostBenefitedOrg, searchMostBenefitedOrg } from '../fetcher';


const mostBenefitedOrgColumns = [
  {
    title: 'Organization',
    dataIndex: 'Organization',
    key: 'Organization',
    sorter: (a, b) => a.Organization.localeCompare(b.Organization)
  },
  {
    title: 'Percentage',
    dataIndex: 'Percentage',
    key: 'Percentage',
    sorter: (a, b) => a.Percentage - b.Percentage,
    render: (_, record) => (
      <div> {parseFloat(record.Percentage * 100).toFixed(2)} </div>
    )
  }
];

class InstitutionsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {

      loadingMostBenefited: true,
      min: 0,
      max: 1,
      mostBenefitedOrgResults: [],
    }

    this.handleMinMaxQueryChange = this.handleMinMaxQueryChange.bind(this)
    this.handleMinQueryChange = this.handleMinQueryChange.bind(this)
    this.handleMaxQueryChange = this.handleMaxQueryChange.bind(this)
    this.updateBenefitedSearchResults = this.updateBenefitedSearchResults.bind(this)

  }

  handleMinQueryChange(event) {
    this.setState({ min: event.target.value })
  }

  handleMaxQueryChange(event) {
    this.setState({ max: event.target.value })
  }

  handleMinMaxQueryChange(values) {
    this.setState({ min: values[0] / 100 })
    this.setState({ max: values[1] / 100 })
  }

  updateBenefitedSearchResults() {

    this.setState({ loadingMostBenefited: true })
    searchMostBenefitedOrg(this.state.min, this.state.max,
      null, null).then(res => {
        this.setState({ mostBenefitedOrgResults: res.results })
        this.setState({ loadingMostBenefited: false })
      })

  }

  componentDidMount() {

    getMostBenefitedOrg().then(res => {
      this.setState({ mostBenefitedOrgResults: res.results })
      this.setState({ loadingMostBenefited: false })
    })
  }

  render() {
    if (window.localStorage.getItem('Authenticated') !== 'True') {
      // go back to the login page since you are not authenticated
      window.location = '/login';
    }
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <MenuBar />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Institution Percentage </h3>
          <h6> Percentage of papers written by a researcher that has migrated</h6>
          <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Percentage Range Slider (0 to 100 %)</label>

                <Slider range={{ draggableTrack: true }} defaultValue={[0, 100]} onChange={this.handleMinMaxQueryChange} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                <Button style={{ marginTop: '4vh' }} onClick={this.updateBenefitedSearchResults}>Search</Button>
              </FormGroup></Col>
            </Row>
          </Form>
          <Table rowKey="Organization" bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning: this.state.loadingMostBenefited }} dataSource={this.state.mostBenefitedOrgResults} columns={mostBenefitedOrgColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />
        </div>
      </div>
    )
  }
}

export default InstitutionsPage

