<?
class Login{

	var $conn;
	public function process($post){
		$out = new stdClass();
		$out->error='hello world';
		
		$cred= explode(',',$post['credetials']);
		$cmd = $cred[0];
		$out->result=$cmd;		
		if($cmd == 'logout') return $this->logout();			
		else if($cmd =='login') return $this->_login($cred[1],$cred[2]);				
		else if($cmd == 'createuser') return $this->createUser($cred[1],$cred[2]);
		else if($cmd == 'checkuser') return $this->checkUser($cred[1]);
		
		return $out;
		
	}
	
	
	
	private function createUser($user,$pass){
			$out = new stdClass();
			if($_SESSION['directories_role']!=='welcome'){
				$out ->result = 'hacker';
				return $out;	
			}
			$user = mysql_real_escape_string($user);
			$pass = mysql_real_escape_string($pass);
			$exists = $this->checkUser($user);
			$ip = $_SERVER['REMOTE_ADDR'];
			$url='?';
			$conn= $this->con();
			
			if($exists->success=='spare'){		
					$sql = "INSERT INTO users (username,pass,status,url,ip) VALUES ('$user','$pass','newuser','$url','$ip')";
					$result = $conn->query($sql);
					if($result){
						$out->success='usercreated';
						$out->result=$url;
						return $out;
					}else{
						$out->error='createerror';
						$out->result=$result;
						return $out;
					}
			}else return $exists;
			
			$out->success='';
			return $out;
	
	}
	private function checkUser($user){
		$user = mysql_real_escape_string($user);
		$out = new stdClass();
		$conn = $this->con();
		$sql = "SELECT * FROM users WHERE username='$user'";
		
		$result = $conn->query($sql);		
		if ($result && $result->num_rows === 0){
				$out->success='spare';
				$out->result =  $user;
				return $out;
		}
		$out->success='taken';
		$out->result =  $user;		
		return $out;
	}
	private function _login($user,$pass){
			$out = new stdClass();
			$user = mysql_real_escape_string($user);
			$pass = mysql_real_escape_string($pass);
		
		$conn= $this->con();
		if($conn->connect_error){
				$out->error = $conn->connect_error;
				return $out;
		}
		
		$sql = "SELECT id,status,url FROM users WHERE username='$user' AND pass='$pass'";
		$result = $conn->query($sql);		
		if ($result && $result->num_rows === 1){
			$row = $result->fetch_assoc();			
			$_SESSION['directories_userid'] = $row['id'];
			$_SESSION['directories_role'] = $row['status'];
			if($row['status']=='welcome'){
				$out->success='loggedin';
				$out->result = 'createuser';	
			}else{
				$out->success='loggedin';
				$out->result = $row['url'];	
			}
					
		}else {
			$out->success=$user.','.$pass;
			$out->result = $result?'num'.$result->num_rows:$result;
			
			
		}		
			return $out;
	}
	private function logout(){
			$out = new stdClass();	
			$_SESSION['directories_userid']=NULL;
			$_SESSION['directories_role']=NULL;
			$out->success='logout';
			$out->msg='User Logout';
			return $out;
	}
	
	private function con(){
			if(!$this->conn) $this->conn = new mysqli('localhost','Vlad','','test');
			return $this->conn;
	}

}