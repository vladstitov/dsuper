<?
class Login{
	var $conn;	
	public function process($a,$get){
		array_shift($a);
		switch(array_shift($a)){
			case 'restore':
				require 'Restore.php';
				$restore = new Restore();
				return $restore->process($a,$get);
				break;
				default:
				$post = json_decode(file_get_contents("php://input"),TRUE);					
				if(!isset($post['credentials']))		return 'OOPS';
				
				$cred= explode(',',$post['credentials']);
				$cmd = $cred[0];				
				if($cmd == 'welcome') return $this->_login($cred[1],$cred[2]);	
				elseif($cmd == 'logout') return $this->logout();			
				else if($cmd =='login') return $this->_login($cred[1],$cred[2]);				
				else if($cmd == 'createuser') return $this->createUser($cred[1],$cred[2],$cred[3]);
				else if($cmd == 'checkuser') return $this->checkUser($cred[1]);					
				break;
		}
				
		return 'OPPS2';		
	}
	
	
	
	
	
	function isValid(){
		if($this->getUserId())	return TRUE;	
		return FALSE;	
	
	}
	function keepData($data,$index){
		$filename = '../temp/'.$index.$this->getUserId().'_'.time().'json';		
		$res = file_put_contents($filename, json_encode($data));
		if($res) {
			 $_SESSION['data_'.$index] = $filename;
			return TRUE;
		}
		return FALSE;	
	}	
	function killData($index){
		if(isset( $_SESSION['data_'.$index])){
			$filename = $_SESSION['data_'.$index];
			unlink($filename);
			$_SESSION['data_'.$index]=0;
		}		
	}
	function getData($index){		
		if(isset($_SESSION['data_'.$index]) && $_SESSION['data_'.$index]!==0) return json_decode(file_get_contents($_SESSION['data_'.$index]));
		return 0;
	}

	function getUser(){
		$id = $this->getUserId();
		if($id){
			$res = $this->con()->query('SELECT * FROM users WHERE id=?',array($id));
			if(count($res)==1) return $res[0];			
		}
		return 0;;
	}
	public static function getId(){
		return isset($_SESSION['directories_userid'])?$_SESSION['directories_userid']:0;
	}
		
	function getUserId(){
		return isset($_SESSION['directories_userid'])?$_SESSION['directories_userid']:0;
	}
	function setUserId($id){
		$_SESSION['directories_userid']=$id;
	}
	function setRole($role){
		$_SESSION['directories_role'] = $role;
	}
	function getRole(){
		return isset($_SESSION['directories_role'])?$_SESSION['directories_role']:0;
	}
	function setInstallFolder($folder){
		$_SESSION['install_folder']=$folder;
	}
	function getInstallFolder(){
		return isset($_SESSION['install_folder'])?$_SESSION['install_folder']:0;
	}
	function setCurrentAccountId($id){
		$_SESSION['accoun_id']=$id;
	}
	function getCurrentAccountId(){
		return isset($_SESSION['accoun_id'])?$_SESSION['accoun_id']:0;
	}

	private function myMd($str){
		$strS = md5($str);
		$sql = "SELECT val FROM extra WHERE ind= (?)";
		$conn = $this->con();
		$res =  $conn->query($sql,array($strS));
		if($res && count($res)) return $strS;
		$sql = "INSERT INTO extra (ind,val) VALUES (?,?)";
		$conn->insertRow($sql,array($strS,$str));
		return $strS;
	}
	
	function log($str){
		error_log("\r\n".date("Y-m-d H:i:s").$str,3,'../logs/login_'.$this->getUserId().'.log');
	}
	function emailError($str){
		error_log($str,1,'uplight.ca@gmail.com');
	}
	function logError($str){
		error_log("\r\n".date("Y-m-d H:i:s").$str,3,'../logs/ERROR_login_'.$this->getUserId().'.log');
	}
	private function createUser($username,$pass,$email){
			$out = new stdClass();			
			if($this->getRole()!=='welcome'){
				$out->success='hacker';					
				return $out;	
			}
			$name= $username;
			$username= $this->myMd($username);
			$pass = $this->myMd($pass);			
					
			$exists = $this->checkUserNmae($username);
			if(!isset($exists->success))	return $exists ;			
			
			$ip = $_SERVER['REMOTE_ADDR'];
			$role='newuser';
			$url='index';
			$conn = $this->con();			
			$sql = "INSERT INTO users (username,pass,status,url,ip,email) VALUES (?,?,?,?,?,?)";
			
			$id = $conn->insertRow($sql,array($username,$pass,$role,$url,$ip,$email));			
			if($id){
					
				$out->success='usercreated';				
				$out->result=$url.'#'.$name;
				
				$this->setRole($role);
				$this->setUserId($id);							
			}else{			
				$out->error='createerror';
				$out->result=$id;
				
			}			
			return $out;	
	}
	
	private function checkUserNmae($username){
		$out = new stdClass();	
		$conn = $this->con();		
		$sql = "SELECT * FROM users WHERE username=?";		
		$result = $conn->query($sql,array($username));		
		if(count($result) === 0){
				$out->success='spare';
				$out->result =  $username;
				return $out;
		}
		$out->error='taken';
		$out->result =  $username;
		$out->message='Please use another username';
		return $out;
	}
	private function isBlocked(){		
		if(isset($_SESSION['login_count']))	$_SESSION['login_count']++;
			else $_SESSION['login_count']=1;
			$num = $_SESSION['login_count'];								
			if($num>100){
				$out = new stdClass();
				if($num>10000){
					$dif = time()-$num;
					if($dif>100){
						$_SESSION['login_count']=1;							
						return 0;					
					}else $out->message=$dif.' seconds left';
				}else $_SESSION['login_count'] = time();					
				$out->error='blocked';
				$out->result=$num;	
				return $out;
			}
		
			return 0;		
	}
	
	
	private function _login($user,$pass){
			$out = new stdClass();
			if($this->isBlocked()) return $this->isBlocked();
								
			$conn = $this->con();
				
		$sql = "SELECT id,status,url FROM users WHERE username=? AND pass=?";
		$user = md5($user);
		$pass = md5($pass);
		$result = $conn->query($sql,array($user,$pass));
		
		if ($result && count($result) === 1){
				$row = $result[0];			
				if($row->status ==='welcome'){
					$this->setUserId(0);
					$out->success='create_user';
				}else{
					$this->setUserId($row->id);
					$out->success='logedin';
				} 				
				$this->setRole($row->status);				
				
				$out->result = $row->url;
				
		}else {				
				$out->error='wrong';
				$out->result =  count($result);	
				$out->message= 'Please check username or password';	
		}		
			return $out;
	}
	private function logout(){
			$out = new stdClass();
			if($this->getUserId())	{
				$_SESSION['login_count']=0;
				$this->setRole(0);
				$this->setUserId(0);
				$out->success='logout';
				$out->result='User Logout';
			}else{
				$out->success='logout';
			}						
			
			return $out;
	}
	
	function con(){
			if(!$this->conn){
				$this->conn =new MyConnector(FALSE);
			} 
			return $this->conn;
	}

}