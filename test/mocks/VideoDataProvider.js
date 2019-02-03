export default function VideoDataProvider () {
  this.getVideo = () => {
    return {
      title: 'title',
      description: 'description',
      picture: 'picture url',
      viewers: 1,
      id: 1,
      isLive: false,
      labels: ['et', 'commodo', 'dolore', 'magna'],
      location: {
        city: 'Mammoth',
        coordinates: {latitude: -1.856885, longitude: 168.464747},
        latitude: -1.856885,
        longitude: 168.464747,
        country: 'Equatorial Guinea'
      },
      type: 'channel'
    }
  }

  this.getVideoList = () => {
    return [{
      title: 'title',
      description: 'description',
      picture: 'picture url',
      viewers: 1,
      id: 1,
      isLive: false,
      labels: ['et', 'commodo', 'dolore', 'magna'],
      location: {
        city: 'Mammoth',
        coordinates: {latitude: -1.856885, longitude: 168.464747},
        latitude: -1.856885,
        longitude: 168.464747,
        country: 'Equatorial Guinea'
      },
      type: 'channel'
    },{
      title: 'title 2',
      description: 'description 2',
      picture: 'picture url2 ',
      viewers: 2,
      id: 2,
      isLive: true,
      labels: ['et', 'commodo', 'dolore', 'magna'],
      location: {
        city: 'Mammoth',
        coordinates: {latitude: -1.856885, longitude: 168.464747},
        latitude: -1.856885,
        longitude: 168.464747,
        country: 'Equatorial Guinea'
      },
      type: 'recorded'
    }]
  }
}
