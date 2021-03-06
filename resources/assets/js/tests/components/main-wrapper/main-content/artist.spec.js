import Component from '@/components/main-wrapper/main-content/artist.vue'
import SongList from '@/components/shared/song-list.vue'
import SongListControls from '@/components/shared/song-list-controls.vue'
import { event } from '@/utils'
import { download, artistInfo as artistInfoService } from '@/services'
import factory from '@/tests/factory'
import Vue from 'vue'

describe('components/main-wrapper/main-content/artist', () => {
  let artist
  beforeEach(() => {
    artist = factory('artist')
    const album = factory('album', {
      artist,
      artist_id: artist.id,
    })
    artist.albums = [album]
    artist.songs = factory('song', 5, {
      artist,
      album,
      artist_id: artist.id,
      album_id: album.id
    })
  })

  it('renders upon receiving event', () => {
    const wrapper = shallow(Component)
    event.emit('main-content-view:load', 'artist', artist)
    Vue.nextTick(() => {
      const html = wrapper.html()
      html.should.contain(artist.name)
      html.should.contain('1 album')
      wrapper.contains(SongList).should.be.true
      wrapper.contains(SongListControls).should.be.true
    })
  })

  it('loads info from Last.fm', () => {
    const wrapper = shallow(Component)
    artist.info = null
    wrapper.setData({
      artist,
      sharedState: { useLastfm: true }
    })
    const stub = sinon.stub(artistInfoService, 'fetch')
    wrapper.find('a.info').trigger('click')
    stub.calledWith(artist).should.be.true
    stub.restore()
  })

  it('allows downloading', () => {
    const wrapper = shallow(Component)
    wrapper.setData({
      artist,
      sharedState: { allowDownload: true }
    })
    const downloadStub = sinon.stub(download, 'fromArtist')
    wrapper.find('a.download').trigger('click')
    downloadStub.calledWith(artist).should.be.true
    downloadStub.restore()
  })
})
