<?
class Restore{	
	function process($a,$get){		
		switch (array_shift($a)) {
			case 'get_user_password':
				return $this->get_user_password(json_decode(file_get_contents("php://input"),TRUE));
				 
				break;				
				case 'email_username':
				return $this->email_username(json_decode(file_get_contents("php://input"),TRUE));
					case 'email_password':
				return $this->email_password(json_decode(file_get_contents("php://input"),TRUE));
			
			default:
				
				break;
		}
	}
	
	function getValue($index,$db){		
		return $db->getField("SELECT val FROM extra WHERE ind = '$index' ");		
	}
	
	function get_user_password($ar){
		$email = $ar['email'];
		if(!$email) {
			return 'ERROR,No email';
		}
		$db =  new MyConnector(0);
		$sql='SELECT username,password FROM users WHERE email=?';
		$res = $db->queryA($sql, array($email));
		if($res && count($res)){
			$user = $res[username];
			$pass = $res[password];
			$user = $db->getField("SELECT value FROM extra WHERE index='$user'");
			$pass = $db->getField("SELECT value FROM extra WHERE index='$pass'");
			return 'RESULT,'.$user.','.$pass;			
		}
		return 'ERROR,no_user_with_email,'.$email;
	}
	
	
	function email_username($ar){
		$out=new stdClass();
		$email = $ar['email'];
		if(!$email) {
			return 'ERROR,No email';
		}
		$db =  new MyConnector(0);

		$sql='SELECT username FROM users WHERE email=?';
		$res = $db->queryA($sql, array($email));
		if($res && count($res)){
			$res = $res[0];		
			$index = $res['username'];		
			$username = $this->getValue($index,$db);			
			if(!$username) return 'ERROR,no_value_for,'.$email;
			$to= $email;
			 $subject= 'Username restore ';
			 $message ='Your username is: '.$username;
			 $headers = 'From: admin@front-desk.ca' . "\r\n" . 'Reply-To: admin@front-desk.ca' . "\r\n" . 'X-Mailer: PHP/' . phpversion();
			mail($to, $subject, $message,$headers);	
				
				$out->success='username_sent_to';
				$out->result=$email;	
				$out->message= 'Username sent to '.$email;	
				$this->log('Username sent to '.$email);
			return $out;//'RESULT,username_sent_to'.$email;		
		}
		
		$this->logError('no_user_with_email '.$email);
		$out->error ='no_user_with_email';
		$out->message = 'No user with email '.$email;
		return $out;		
}
	
	function email_password($ar){
		$username = $ar['username'];
		if(!$username) {
			return 'ERROR,No email';
		}
		$out=new stdClass();
		$usernameS = md5($username);
		$db =  new MyConnector(0);
		$sql='SELECT pass,email FROM users WHERE username=?';
		$res = $db->queryA($sql, array($usernameS));		
		if($res && count($res)){
			$res= $res[0];
			$pass = $res['pass'];
			$email = $res['email'];		
			$password = $this->getValue($pass,$db);//$db->getField("SELECT value FROM extra WHERE index='$pass'");
			if(!$password) return 'ERROR,no_value_for,'.$username;
			$to= $email;
			 $subject= 'Password restore for '.$username;
			 $message ='Your password is: '.$password;
			 $headers = 'From: admin@front-desk.ca' . "\r\n" . 'Reply-To: admin@front-desk.ca' . "\r\n" . 'X-Mailer: PHP/' . phpversion();
				mail($to, $subject, $message,$headers);

				$out->success='password_sent_to';				
				$out->result=$email.$password;
				$out->message= 'Password sent to your email';
				$this->log('password_sent_to '.$email);
			return $out;//'RESULT,'.$password.','.$email;
		}
		$this->logError('no_user_with_username '.$username);
		$out->error ='no_user_with_username';
		$out->message = 'No user with Username '.$username;
		return  $out;//'ERROR,no_user_with_username,'.$username;
	}

	private function getUserId(){
		return Login::getId();
	}
	function log($log){
		error_log("\r\n ".date("Y-m-d H:i:s").'  '.$log,3,'../logs/restore_'.$this->getUserId().'.log');
	}

	function emailError($err){
		error_log($err,1,'uplight.ca@gmail.com');
	}
	
	function logError($err){
		error_log("\r\n ".date("Y-m-d H:i:s").'  '.$err,3,'../logs/ERROR_restore_'.$this->getUserId().'.log');
	}
}
