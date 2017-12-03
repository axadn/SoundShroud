export default const PlaylistCoverArt = props => {
  <div className = "playlist-cover-art">
    <img> src={props.img_url}</img>
      <div className="info">
        <Link className="username-link"
          to={`/users/${props.artist_id}`}>{props.artist_display_name}</Link>
        <Link className="title-link"
          to={`/tracks/${props.track_id}`}>{props.title}</Link>
      </div>
  </div>
};
