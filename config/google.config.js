import googleOAuth from "passport-google-oauth20";
import { UserModel } from "../database/allModels";

//STrategy mthod by which  we can authenticat ein googe
// preexisting
const GoogleStrategy = googleOAuth.Strategy;

export default (passport) => {
  passport.use(
      //initialiation of the user entry
    new GoogleStrategy(
      {

        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/google/callback",
        //dont with straetgy will call back to this url
      },
      async (accessToken, refreshToken, profile, done) => {
        // request based funcition no await requires
        //after authnticated from google u get this infor
        const newUser = {
          fullName: profile.displayName,//ptofile has full name
          email: profile.emails[0].value,//primary email
          profilePic: profile.photos[0].value,//primary pic
        };

        try {
         
          const user = await UserModel.findOne({ email: newUser.email });
           if (user) {
            const token = user.generateJwtToken();

            // return usern dont want google to do anything
            done(null, { user, token });
          } else {
            const user = await UserModel.create(newUser);
            const token = user.generateJwtToken();
            done(null, { user, token });
          }
        } catch (error) {
          done(error, null);//works like next//second is call back
        }
      }
    )
  );
  //compulsary lines
  passport.serializeUser((userData, done) => done(null, { ...userData }));
  passport.deserializeUser((id, done) => done(null, id));
};