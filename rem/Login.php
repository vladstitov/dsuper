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
			
			$exists = $this->checkUser($user);
			if($exists->success=='taken')	return $exists ;			
			
			$ip = $_SERVER['REMOTE_ADDR'];
			$url='?';
			$conn = $this->con();			
			$sql = "INSERT INTO users (username,pass,status,url,ip) VALUES (?,?,?,?,?)";
			$result = $conn->query($sql,array($user,$pass,'newuser',$url,$ip));
			if($result){
				$out->success='usercreated';
				$out->result=$url;	
				$_SESSION['directories_role']='newuser';
				$_SESSION['directories_userid']= $result;
				
			}else{
			
				$out->error='createerror';
				$out->result=$result;
				return $out;
			}			
			return $out;	
	}
	
	private function checkUser($user){
		$out = new stdClass();	
		$conn = $this->con();		
		$sql = "SELECT * FROM users WHERE username=?";		
		$result = $conn->query($sql,array($user));		
		if(count($result) === 0){
				$out->success='spare';
				$out->result =  $user;
				return $out;
		}
		$out->success='taken';
		$out->result =  $result;		
		return $out;
	}
	private function _login($user,$pass){
			$out = new stdClass();			
		
			$conn = $this->con();	
		
		$sql = "SELECT id,status,url FROM users WHERE username=? AND pass=?";
		$result = $conn->query($sql,array($user,$pass));
		
		if ($result && count($result) === 1){
				$row = $result[0];
				$_SESSION['directories_userid'] = $row->id;
				$_SESSION['directories_role'] = $row->status;
				$out->success='loggedin';
				$out->result = $row->url;
		}else {
				$out->success='wrong';
				$out->result =  count($result);			
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
			if(!$this->conn) $this->conn =new MyConnector(FALSE);
			return $this->conn;
	}

}