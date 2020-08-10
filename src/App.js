import React, { Component } from 'react'
import Venue from './Venue'
import Modal from 'react-bootstrap/Modal'
import './App.css'

var clientId = 'PN4Y5ISZD1GXUQPTPFC4VYD5ZXXMIYR2TLPUKU5YCYM5L0O1'
var clientSecret = 'N110GTRJL4RHVLOY5T5UCNRLNEKUMAECV0GJ4HW4GXFAZYV1'
var key = '?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20200801'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      venues: [],
      isModalOpen: false,
      modalVenue: {
        id: 1,
        name: 'Name',
        category: 'category',
        address: 'address',
        description: 'description',
        photo: 'photo'
      }
    }
  }

  loadVenues = () => {

    var latlong = '-36.843480,174.766159'
    var url = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=' + latlong

    //Make AJAX request to endpoint
    fetch(url)
      .then((res) => {
        return res.json()
      })

      .then((data) => {
        return data.response.groups[0].items
      })

      .then((data) => {
        return data.map((item) => {
          var venue = {
            id: item.venue.id,
            name: item.venue.name,
            address: item.venue.location.address,
            city: item.venue.location.city,
            category: item.venue.categories[0].shortName
          }
          return venue
        })
      })

      .then((data) => {
        this.setState({
          venues: data
        })
      })
  }

  loadVenue = (id) =>{
    var url = 'https://api.foursquare.com/v2/venues/' + id + key
    
    fetch(url)
    .then(res => res.json())
    .then(data => {
        var item = data.response.venue
        var venue = {
            id:item.id,
            name:item.name,
            category:item.categories[0].shortName,
            address:item.location.address,
            city:item.location.city,
            description:item.description,
            photo:item.bestPhoto.prefix + '300x300' + item.bestPhoto.suffix
        }
        return venue
    })
    .then(data => {
      this.setState({
        modalVenue: data
      })
    })
}

  openModal = () => {
    this.setState({
      isModalOpen: true
    })
  }
  
  closeModal = () => {
    this.setState({
      isModalOpen: false
    })
  }

  componentDidMount(){
    this.loadVenues()
  }

  render() {
    return (
      <div className="app">
        <div className="container">
          <div className="venues">
            {
              this.state.venues.map(venue => {
                var props = {
                  key: venue.id,
                  loadVenues: this.loadVenues,
                  loadVenue: this.loadVenue,
                  openModal: this.openModal,
                  ...venue
                }

                return (
                  <Venue {...props} />
                )
              })
            }

          </div>

          <div className="venue-filters">

            <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <div role="group" className="btn-group btn-group-toggle">
                <label className="venue-filter btn active btn-primary">
                  <input name="venue-filter" type="radio" autocomplete="off" value="all" checked="" />All
              </label>
                <label className="venue-filter btn btn-primary">
                  <input name="venue-filter" type="radio" autocomplete="off" value="food" />Food
              </label>
                <label className="venue-filter btn btn-primary">
                  <input name="venue-filter" type="radio" autocomplete="off" value="drinks" />Drinks
              </label>
                <label className="venue-filter btn btn-primary">
                  <input name="venue-filter" type="radio" autocomplete="off" value="others" />Others
              </label>
              </div>
            </div>
          </div>
        </div>

        <Modal show={this.state.isModalOpen} onHide={this.closeModal}>
          <Modal.Body>
            <div className="venue-popup-body row">
              <div className="col-6">
                <h1 className="venue-name">{this.state.modalVenue.name}</h1>
                <p>{this.state.modalVenue.address}</p>
                <p>{this.state.modalVenue.city}</p>
                <p><span className="badge venue-type">{this.state.modalVenue.category}</span></p>
              </div>
              <div className="col-6">
                <img src={this.state.modalVenue.photo} className="img-fluid" alt="Responsive image" />
              </div>
            </div>
          </Modal.Body>
        </Modal>

        
      </div>
    );
  }
}

export default App;
