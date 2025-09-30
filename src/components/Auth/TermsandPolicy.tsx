// Terms and Conditions Modal Component
interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}


export const TermsAndConditionsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Terms and Conditions
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-semibold"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
          {/* Your Terms and Conditions Content */}
          <div className="prose max-w-none text-gray-700">
            <p>
              Please read these Terms and Conditions carefully before using the
              Parcel web application, operated by Dolph Tech and Flair
              Technologies. By accessing or using our service, you agree to be
              bound by these Terms. If you disagree with any part of the terms,
              then you may not access the service.
            </p>

            <br />

            <h3 className="font-bold">1. Description of Service</h3>
            <br />
            <p>
              Parcel is a logistics service currently operating exclusively
              within Lokoja, Kogi State, Nigeria. Our web application,
              accessible at theparcel.com.ng or www.theparcel.com.ng, allows
              users to transport items ("parcels") from one location to another
              within Lokoja. The service is designed for use on desktops, mobile
              devices, and tablets.
            </p>
            <br />

            <p>
              Our target users include businesses, individuals, and students who
              wish to send items. An ideal parcel size and weight for transport
              by one person on a bike is generally up to 15 kg (approximately 33
              lbs) and dimensions not exceeding 50cm x 40cm x 30cm (length x
              width x height). If the weight or size of your parcel exceeds
              these specifications, a 50% refund will be issued for the service.
            </p>
            <br />

            <p>
              When sending a parcel, we will collect the name, email, and phone
              number of the receiver, as well as the name and description of the
              parcel from you. We do not require users to upload any content to
              the platform at this time.
            </p>
            <br />

            <h3 className="font-bold">2. User Accounts</h3>
            <br />

            <p>
              To use Parcel's services, you are required to create an account.
              The account creation process is fast and straightforward. We
              collect your username, email, and password during registration.
              You must be at least 15 years of age to create an account and use
              our services.
            </p>
            <br />

            <h3 className="font-bold">3. Pricing and Payments</h3>
            <br />

            <p>
              Parcel charges for each service rendered, not on a subscription
              basis. Our primary payment method is Paystack, which supports
              various options including bank transfers, OPay, and debit cards.
            </p>
            <br />

            <h4>Refund and Additional Charges Policy:</h4>
            <br />

            <ul>
              <li>
                <strong>Damaged Goods:</strong> If we are responsible for
                damaging your goods during transit, a full refund will be
                issued.
              </li>
              <li>
                <strong>Incorrect Address:</strong> No refund will be provided
                if you supply an incorrect delivery address.
              </li>
              <li>
                <strong>Receiver Unavailability:</strong> If the receiver is not
                available to receive the goods on the scheduled delivery day, an
                additional charge of ₦1,000 will be applied for each day we have
                to store the parcel. This charge will be paid by the receiver
                upon final delivery.
              </li>
            </ul>
            <br />

            <h3 className="font-bold">4. Data Collection and Privacy</h3>
            <br />

            <p>
              We collect personal data including your name, email, phone number,
              and address. This data is stored in our secure database. When you
              delete your account, we retain your data for an additional three
              (3) months before permanent deletion. Passwords are encrypted, and
              we do not sell your data to third parties. We only share your
              email address with Paystack to facilitate payment processing. We
              are committed to ensuring the security of your data.
            </p>

            <br />

            <h3 className="font-bold">5. Intellectual Property</h3>
            <br />

            <p>
              All intellectual property rights, including software, content, and
              trademarks associated with Parcel, are exclusively owned by Dolph
              Tech and Flair Technologies. In the future, should we enable
              user-uploaded content, our policy regarding such content will be
              updated accordingly.
            </p>
            <br />

            <h3 className="font-bold">6. Company Status and Liability</h3>
            <br />

            <p>
              Parcel is not currently an incorporated entity. All damages, legal
              actions, and complaints will be directed to and handled by Dolph
              Tech and Flair Technologies.
            </p>
            <br />

            <h3 className="font-bold">7. Account Termination</h3>
            <br />

            <p>
              We reserve the right to terminate user accounts if a user makes
              prank orders or cancels orders more than once. Users can terminate
              their own accounts at any time through their profile page within
              the web application.
            </p>
            <br />

            <h3 className="font-bold">
              8. Governing Law and Dispute Resolution
            </h3>
            <br />

            <p>
              These Terms and Conditions shall be governed by and construed in
              accordance with the laws of Nigeria. Any dispute arising out of or
              in connection with these Terms will first be resolved through
              arbitration. Should arbitration fail to resolve the dispute, legal
              proceedings may be initiated in a court with Uyo jurisdiction.
            </p>
            <br />

            <h3 className="font-bold">9. Amendments to Terms</h3>
            <br />

            <p>
              Any updates or amendments to these Terms and Conditions will be
              communicated to users via our social media handles and through
              email notifications.
            </p>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyModal: React.FC<PrivacyPolicyProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-semibold"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
          {/* Your Privacy Policy Content */}
          <div className="prose max-w-none text-gray-700">
            <p>
              <strong>Last Updated: July 6, 2025</strong>
            </p>
            <br />
            <p>
              This Privacy Policy describes how
              <strong> Parcel</strong>, operated by Dolph Tech Ltd & Flair
              Technologies Ltd ("we," "us," or "our"), collects, uses, and
              protects your personal information when you use our web
              application and services (collectively, the "Service").
            </p>

            <p>
              By accessing or using our Service, you agree to the collection and
              use of information in accordance with this policy.
            </p>
            <br />
            <h3 className="font-bold">1. Information We Collect</h3>

            <p>
              We collect various types of information to provide and improve our
              Service to you.
            </p>
            <br />
            <h4 className="font-semibold">Personal Data</h4>

            <p>
              While using our Service, we may ask you to provide us with certain
              personally identifiable information that can be used to contact or
              identify you ("Personal Data"). Personal Data we collect includes,
              but is not limited to:
            </p>
            <br />
            <ul>
              <li>
                <strong>Account Information:</strong> Your username, email
                address, and password when you create an account.
              </li>
              <li>
                <strong>Contact Information:</strong> Your name, email address,
                phone number, and physical address.
              </li>
              <li>
                <strong>Receiver Information:</strong> When sending a parcel, we
                collect the name, email, and phone number of the receiver.
              </li>
              <li>
                <strong>Parcel Information:</strong> The name and description of
                the parcel you are sending.
              </li>
            </ul>
            <br />
            <h4 className="font-semibold">Usage Data</h4>

            <p>
              We may also collect information about how the Service is accessed
              and used ("Usage Data"). This Usage Data may include information
              such as your computer's Internet Protocol address (e.g., IP
              address), browser type, browser version, the pages of our Service
              that you visit, the time and date of your visit, the time spent on
              those pages, unique device identifiers, and other diagnostic data.
            </p>
            <br />
            <h3 className="font-bold">2. How We Use Your Information</h3>

            <p>Parcel uses the collected data for various purposes:</p>
            <br />
            <ul>
              <li>To provide and maintain our Service.</li>
              <li>
                To manage your account and provide you with access to our
                services.
              </li>
              <li>To process and fulfill your parcel delivery requests.</li>
              <li>
                To communicate with you about your orders, updates, and other
                service-related information.
              </li>
              <li>To ensure the security of your data and our Service.</li>
              <li>To facilitate payment processing through Paystack.</li>
              <li>To monitor the usage of the Service.</li>
              <li>To detect, prevent, and address technical issues.</li>
            </ul>
            <br />
            <h3 className="font-bold">3. Sharing Your Information</h3>

            <p>
              We value your privacy and are committed to protecting your data.
              We do not sell your Personal Data to third parties.
            </p>
            <br />
            <p>
              We only share your email address with Paystack to facilitate
              payment processing for the services you use.
            </p>
            <br />

            <h3 className="font-bold">4. Data Security</h3>

            <p>
              The security of your data is paramount to us. We store your
              personal data in our secure database. Your passwords are
              encrypted. While we strive to use commercially acceptable means to
              protect your Personal Data, please remember that no method of
              transmission over the Internet or method of electronic storage is
              100% secure. We cannot guarantee its absolute security.
            </p>
            <br />

            <h3 className="font-bold">5. Data Retention</h3>

            <p>
              When you delete your account, we retain your data for an
              additional three (3) months before permanent deletion from our
              systems. This retention period allows for administrative purposes
              and to address any potential disputes or issues that may arise
              shortly after account termination.
            </p>
            <br />

            <h3 className="font-bold">6. Age Restriction</h3>

            <p>
              To create an account and use our services, you must be at least 15
              years of age.
            </p>
            <br />

            <h3 className="font-bold">7. Changes to This Privacy Policy</h3>

            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </p>
            <br />

            <p>
              We will also communicate updates or amendments to this Privacy
              Policy via our social media handles and through email
              notifications.
            </p>
            <br />

            <p>
              You are advised to review this Privacy Policy periodically for any
              changes. Changes to this Privacy Policy are effective when they
              are posted on this page.
            </p>
            <br />

            <h3 className="font-bold">8. Contact Us</h3>

            <p>
              If you have any questions about this Privacy Policy, please
              contact us through the channels provided by Dolph Tech Ltd & Flair
              Technologies Ltd.
            </p>
            <br />

            <p>Operated by: Dolph Tech Ltd & Flair Technologies Ltd</p>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};