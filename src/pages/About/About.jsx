import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className='contentWrapper'>
        <div className='m-3'>
            <h3>Are you hard to get presents for?</h3>
            <h3>Keep all your important birthday information in one place.</h3>
        </div>
        <p className=''>Create your own profile and wishlist and share with friends and family</p>

        <p className='m-3'>See an example Birthday profile
        <Link to="/user/TimmyC">
            <strong> Here</strong>
        </Link>
        </p>
        <p>Add friends and family to your birthday diary so you never forget</p>
        <p>and create wishlists for them too.</p>
        <img className="shadow-lg m-3" src="/examplehome.png" alt="" width="300vmin"/>
        <p className='m-3'>Keep track of if you've got them a card and present.</p>
        <p>Never forget a birthday again!</p>

    </div>
  )
}
