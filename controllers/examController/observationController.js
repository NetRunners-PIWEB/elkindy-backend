const Observation = require('../../models/observation'); // Assurez-vous que le nom de la classe est correctement orthographié
const User = require('../../models/user');
const Notification = require('../../models/notificationExams');
const axios = require('axios');
const accountSid = '';
const authToken = '';
//const client = require('twilio')(accountSid, authToken);
const { Vonage } = require('@vonage/server-sdk')
const { io, server, app, getUser }  = require('../../socket/socket');
const vonage = new Vonage({
  apiKey: "7010882a",
  apiSecret: "veud0i2Ds10qAvMz"
})

module.exports = { 

  async createObs(req, res) {
    try {
      const observation = req.body; 
      console.log(observation);// Accédez à l'objet observation
      const newObs = new Observation(observation);
      // Passez les données d'observation à la nouvelle instance
      await newObs.save();
      const newNotification = new Notification({
        message: newObs.description ,
        receiver: newObs.student
        
      });
       await newNotification.save();
      //const io = global.io;
        const recipientSocketId = getRecipientSocketId(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("newobs", newNotification);
        }
      // const users = global.users;
     /* const socketuser=global.users.find((user) => user.userId === observation.student);
       console.log('farah'+socketuser)
       
       if(socketuser){
      io.to(socketuser.socketId).emit('newobs', newNotification);
       }*/
      // Maintenant, envoyez la notification à l'URL spécifiée (localhost:3001/student/exams/notification)
      // await axios.post('http://localhost:3001/student/exams', {
      //   observation: newObs,
      // }); 
 
  
      res.status(201).json(newObs);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },
  
  
    async getobs(req, res) {
      try {
          const obs = await Observation.find(
            {
              
              student : req.params.id
          }
          );
          res.status(200).json(obs);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  },

  async getnotifs(req, res) {
    try {
        const obs = await Notification.find(
          {
            
            receiver : req.params.id
        }
        );
        res.status(200).json(obs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},
  async getStudent(req, res) {
    try {
        const student = await User.findOne({  username: req.params.username }).select('_id');
        if (student) {
            res.json(student._id); 
        } else {
            res.status(404).json({ message: "Aucun étudiant trouvé avec ce nom d'utilisateur." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},
async  validatePhoneNumber(phoneNumber) {
  // Votre logique de validation de numéro de téléphone ici
  // Par exemple, vous pouvez utiliser une expression régulière pour vérifier si le format du numéro est valide
  const phoneRegex = /^[+]?[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4,6}$/;
  return phoneRegex.test(phoneNumber);
},

async getTeacherById(req, res) {
  try {
    const user = await User.findById(req.params.id).select('username');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

async addPhoneNumberToTwilio(phoneNumber) {
  /*try {
    // Utilisez l'API Twilio pour ajouter le numéro de téléphone
    const twilioNumber = await client.incomingPhoneNumbers.create({
      phoneNumber: phoneNumber
    });

    console.log(`Numéro de téléphone ${twilioNumber.phoneNumber} ajouté avec succès à votre compte Twilio.`);
    return true; // Indique que l'ajout a réussi
  } catch (error) {
    console.error('Erreur lors de l\'ajout du numéro de téléphone à Twilio:', error);
    return false; // Indique que l'ajout a échoué
  }*/
  const from = "Vonage APIs"
const to = "21699289785"
const text = 'A text message sent using the Vonage SMS API'

await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
},

async  sendSms(req, res) {
 /* try {
    const phoneNumber = req.params.phoneNumber; // Suppose que req.body.phoneNumber est le numéro de téléphone à vérifier et à envoyer un SMS
    const isValidPhoneNumber = await validatePhoneNumber(phoneNumber);

    if (!isValidPhoneNumber) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // Ajouter le numéro de téléphone à Twilio
    // Notez que vous devez implémenter cette fonction pour ajouter dynamiquement le numéro de téléphone à votre compte Twilio
    await addPhoneNumberToTwilio(phoneNumber);

    // Envoyer le SMS une fois que le numéro est ajouté avec succès
    const message = await client.messages.create({
      body: 'Hello from Twilio!',
      from: '+13023398050', // Votre numéro Twilio
      to: phoneNumber,
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }*/
  /*const from = "Vonage APIs"
  const to = "21696594628"
  const text = 'A text message sent using the Vonage SMS API'
  
  await vonage.sms.send({to, from, text})
          .then(resp => { console.log('Message sent successfully'); console.log(resp); })
          .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
          */
         
          res.json("done"); 
}



}